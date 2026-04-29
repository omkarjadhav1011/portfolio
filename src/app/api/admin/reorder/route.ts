import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

type ReorderType = "stack" | "projects" | "experience";

const VALID_TYPES: ReorderType[] = ["stack", "projects", "experience"];

// Fetch all items for a given type sorted by (order ASC, createdAt ASC)
async function fetchAll(type: ReorderType) {
  switch (type) {
    case "stack":
      return prisma.skillDiff.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
    case "projects":
      return prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
    case "experience":
      return prisma.commitEntry.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  }
}

// Assign contiguous 1-based order values to all items (normalizes duplicates/zeros)
async function normalizeOrder(type: ReorderType, items: { id: string }[]) {
  switch (type) {
    case "stack":
      return prisma.$transaction(
        items.map(({ id }, i) => prisma.skillDiff.update({ where: { id }, data: { order: i + 1 } }))
      );
    case "projects":
      return prisma.$transaction(
        items.map(({ id }, i) => prisma.project.update({ where: { id }, data: { order: i + 1 } }))
      );
    case "experience":
      return prisma.$transaction(
        items.map(({ id }, i) => prisma.commitEntry.update({ where: { id }, data: { order: i + 1 } }))
      );
  }
}

async function bulkReorder(type: ReorderType, items: { id: string; position: number }[]) {
  switch (type) {
    case "stack":
      return prisma.$transaction(
        items.map(({ id, position }) => prisma.skillDiff.update({ where: { id }, data: { order: position } }))
      );
    case "projects":
      return prisma.$transaction(
        items.map(({ id, position }) => prisma.project.update({ where: { id }, data: { order: position } }))
      );
    case "experience":
      return prisma.$transaction(
        items.map(({ id, position }) => prisma.commitEntry.update({ where: { id }, data: { order: position } }))
      );
  }
}

// Swap by index: fetches all items, finds current by id, swaps with neighbor
async function adjacentSwap(type: ReorderType, id: string, direction: "up" | "down") {
  const all = await fetchAll(type);

  // Detect and fix non-contiguous order values before swapping
  const hasGaps = all.some((item, i) => (item as { order: number }).order !== i + 1);
  if (hasGaps) {
    await normalizeOrder(type, all);
    // Re-fetch with normalized values
    const normalized = await fetchAll(type);
    return swapByIndex(type, normalized, id, direction);
  }

  return swapByIndex(type, all, id, direction);
}

async function swapByIndex(
  type: ReorderType,
  all: { id: string; order: number }[],
  id: string,
  direction: "up" | "down"
) {
  const idx = all.findIndex((item) => item.id === id);
  if (idx === -1) return null;

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= all.length) return null;

  const current = all[idx];
  const neighbor = all[swapIdx];
  const currentOrder = current.order;
  const neighborOrder = neighbor.order;

  switch (type) {
    case "stack":
      return prisma.$transaction([
        prisma.skillDiff.update({ where: { id: current.id }, data: { order: neighborOrder } }),
        prisma.skillDiff.update({ where: { id: neighbor.id }, data: { order: currentOrder } }),
      ]);
    case "projects":
      return prisma.$transaction([
        prisma.project.update({ where: { id: current.id }, data: { order: neighborOrder } }),
        prisma.project.update({ where: { id: neighbor.id }, data: { order: currentOrder } }),
      ]);
    case "experience":
      return prisma.$transaction([
        prisma.commitEntry.update({ where: { id: current.id }, data: { order: neighborOrder } }),
        prisma.commitEntry.update({ where: { id: neighbor.id }, data: { order: currentOrder } }),
      ]);
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type } = body as { type: ReorderType };

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    if (Array.isArray(body.items)) {
      const { items } = body as { items: { id: string; position: number }[] };
      if (!items.every((i) => typeof i.id === "string" && typeof i.position === "number")) {
        return NextResponse.json({ error: "Invalid items payload" }, { status: 400 });
      }
      await bulkReorder(type, items);
      revalidatePath("/");
      revalidatePath("/admin/experience");
      revalidatePath("/admin/projects");
      return NextResponse.json({ success: true });
    }

    const { id, direction } = body as { id: string; direction: "up" | "down" };
    if (!id || !["up", "down"].includes(direction)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const result = await adjacentSwap(type, id, direction);
    if (!result) {
      return NextResponse.json({ error: "Cannot move further" }, { status: 400 });
    }

    revalidatePath("/");
    revalidatePath("/admin/experience");
    revalidatePath("/admin/projects");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to reorder" }, { status: 500 });
  }
}
