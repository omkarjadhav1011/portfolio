import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { projectSchema } from "@/lib/admin-validations";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { pinned: "desc" } });
    return NextResponse.json(
      projects.map((p) => ({ ...p, tags: JSON.parse(p.tags) }))
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = projectSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        ...data,
        tags: JSON.stringify(data.tags),
        liveUrl: data.liveUrl || null,
        repoUrl: data.repoUrl || null,
      },
    });

    revalidatePath("/");
    revalidatePath("/projects/[slug]", "page");
    return NextResponse.json({ ...project, tags: JSON.parse(project.tags) }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
