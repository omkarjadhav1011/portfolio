import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { commitEntrySchema } from "@/lib/admin-validations";

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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = commitEntrySchema.parse(body);

    const entry = await prisma.commitEntry.update({
      where: { id: params.id },
      data: {
        ...data,
        description: JSON.stringify(data.description),
        tags: data.tags ? JSON.stringify(data.tags) : null,
        url: data.url || null,
        dateEnd: data.dateEnd || null,
        colorKey: data.colorKey || null,
      },
    });

    revalidatePath("/");
    return NextResponse.json(serialize(entry));
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.commitEntry.delete({ where: { id: params.id } });
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}
