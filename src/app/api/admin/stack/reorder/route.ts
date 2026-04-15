import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, direction } = await request.json();

    if (!id || !["up", "down"].includes(direction)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const current = await prisma.skillDiff.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const neighbor = await prisma.skillDiff.findFirst({
      where: {
        order: direction === "up" ? { lt: current.order } : { gt: current.order },
      },
      orderBy: { order: direction === "up" ? "desc" : "asc" },
    });

    if (!neighbor) {
      return NextResponse.json({ error: "Cannot move further" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.skillDiff.update({ where: { id: current.id }, data: { order: neighbor.order } }),
      prisma.skillDiff.update({ where: { id: neighbor.id }, data: { order: current.order } }),
    ]);

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to reorder" }, { status: 500 });
  }
}
