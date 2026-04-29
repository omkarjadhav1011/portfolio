import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { commitEntrySchema } from "@/lib/admin-validations";

export const dynamic = "force-dynamic";

function serialize(entry: {
  id: string; hash: string; type: string; title: string; org: string;
  date: string; dateEnd: string | null; description: string; branch: string;
  branchColor: string; colorKey: string | null; tags: string | null;
  url: string | null; createdAt: Date; updatedAt: Date;
}) {
  return {
    ...entry,
    description: JSON.parse(entry.description) as string[],
    tags: entry.tags ? JSON.parse(entry.tags) as string[] : undefined,
  };
}

export async function GET() {
  try {
    const entries = await prisma.commitEntry.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(entries.map(serialize));
  } catch {
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = commitEntrySchema.parse(body);

    const maxOrder = await prisma.commitEntry.aggregate({ _max: { order: true } });
    const nextOrder = (maxOrder._max.order ?? 0) + 1;

    const entry = await prisma.commitEntry.create({
      data: {
        ...data,
        description: JSON.stringify(data.description),
        tags: data.tags ? JSON.stringify(data.tags) : null,
        url: data.url || null,
        dateEnd: data.dateEnd || null,
        colorKey: data.colorKey || null,
        order: nextOrder,
      },
    });

    revalidatePath("/");
    return NextResponse.json(serialize(entry), { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
  }
}
