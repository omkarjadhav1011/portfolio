import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { getPortfolioContext } from "@/lib/chatbot/context";
import { buildSystemPrompt } from "@/lib/chatbot/prompt";
import { checkRateLimit, clientIpFrom } from "@/lib/chatbot/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(10),
});

const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 1024;

const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
};

function encodeEvent(payload: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`);
}

export async function POST(request: NextRequest) {
  // ── Rate limit ─────────────────────────────────────────────────────────
  const ip = clientIpFrom(request.headers);
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds ?? 60) },
      }
    );
  }

  // ── Validate body ──────────────────────────────────────────────────────
  let parsed;
  try {
    const body = await request.json();
    parsed = requestSchema.safeParse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }
  const { messages } = parsed.data;
  if (messages[messages.length - 1].role !== "user") {
    return NextResponse.json(
      { error: "Last message must be from the user" },
      { status: 400 }
    );
  }

  // ── API key check ──────────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[chat] ANTHROPIC_API_KEY is not set");
    return NextResponse.json(
      { error: "Chat is temporarily unavailable." },
      { status: 503 }
    );
  }

  // ── Build system prompt from live DB context ───────────────────────────
  let systemPrompt: string;
  try {
    const ctx = await getPortfolioContext();
    systemPrompt = buildSystemPrompt(ctx);
  } catch (err) {
    console.error("[chat] failed to load portfolio context:", err);
    return NextResponse.json(
      { error: "Chat is temporarily unavailable." },
      { status: 503 }
    );
  }

  // ── Stream response ────────────────────────────────────────────────────
  const client = new Anthropic({ apiKey });
  const abortController = new AbortController();

  // If the client disconnects, abort the upstream stream so we stop billing
  // tokens for nobody.
  request.signal.addEventListener("abort", () => abortController.abort());

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = client.messages.stream(
          {
            model: MODEL,
            max_tokens: MAX_TOKENS,
            system: systemPrompt,
            messages,
          },
          { signal: abortController.signal }
        );

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encodeEvent({ type: "delta", text: event.delta.text })
            );
          }
        }

        controller.enqueue(encodeEvent({ type: "done" }));
        controller.close();
      } catch (err: unknown) {
        // Aborted by client → silent close.
        if (
          (err instanceof Error && err.name === "AbortError") ||
          abortController.signal.aborted
        ) {
          try {
            controller.close();
          } catch {
            /* already closed */
          }
          return;
        }
        console.error("[chat] streaming error:", err);
        try {
          controller.enqueue(
            encodeEvent({
              type: "error",
              message: "The assistant ran into a problem.",
            })
          );
          controller.close();
        } catch {
          /* already closed */
        }
      }
    },
    cancel() {
      abortController.abort();
    },
  });

  return new Response(readable, { headers: SSE_HEADERS });
}
