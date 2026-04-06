import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { skillBranchSchema } from "@/lib/admin-validations";

export async function GET() {
  try {
    const branches = await prisma.skillBranch.findMany({
      include: { skills: true },
      orderBy: { offset: "asc" },
    });
    return NextResponse.json(branches);
  } catch {
    return NextResponse.json({ error: "Failed to fetch branches" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = skillBranchSchema.parse(body);

    const branch = await prisma.skillBranch.create({
      data,
      include: { skills: true },
    });

    revalidatePath("/");
    return NextResponse.json(branch, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create branch" }, { status: 500 });
  }
}
