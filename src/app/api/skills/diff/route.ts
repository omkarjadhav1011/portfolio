import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { skillDiffSchema } from "@/lib/admin-validations";

export async function GET() {
  try {
    const diffs = await prisma.skillDiff.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json(diffs);
  } catch {
    return NextResponse.json({ error: "Failed to fetch diffs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = skillDiffSchema.parse(body);

    const diff = await prisma.skillDiff.create({ data });
    revalidatePath("/");
    return NextResponse.json(diff, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create diff" }, { status: 500 });
  }
}
