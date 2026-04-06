import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { projectSchema } from "@/lib/admin-validations";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = projectSchema.parse(body);

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...data,
        tags: JSON.stringify(data.tags),
        liveUrl: data.liveUrl || null,
        repoUrl: data.repoUrl || null,
      },
    });

    revalidatePath("/");
    revalidatePath("/projects/[slug]", "page");
    return NextResponse.json({ ...project, tags: JSON.parse(project.tags) });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.project.delete({ where: { id: params.id } });
    revalidatePath("/");
    revalidatePath("/projects/[slug]", "page");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
