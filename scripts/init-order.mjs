// Run with: node scripts/init-order.mjs
// Assigns contiguous 1-based order values to all CommitEntry, Project, and SkillDiff rows
// that currently have order=0 or duplicate order values.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function initModel(label, findMany, updateFn) {
  const items = await findMany();
  const needsInit = items.every((i) => i.order === 0) || new Set(items.map((i) => i.order)).size < items.length;
  if (!needsInit) {
    console.log(`${label}: already initialized (${items.length} items)`);
    return;
  }
  // Sort by createdAt to preserve original insertion order
  const sorted = [...items].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  for (let i = 0; i < sorted.length; i++) {
    await updateFn(sorted[i].id, i + 1);
  }
  console.log(`${label}: initialized ${sorted.length} items`);
}

await initModel(
  "CommitEntry (Experience)",
  () => prisma.commitEntry.findMany({ select: { id: true, order: true, createdAt: true } }),
  (id, order) => prisma.commitEntry.update({ where: { id }, data: { order } })
);

await initModel(
  "Project",
  () => prisma.project.findMany({ select: { id: true, order: true, createdAt: true } }),
  (id, order) => prisma.project.update({ where: { id }, data: { order } })
);

await initModel(
  "SkillDiff",
  () => prisma.skillDiff.findMany({ select: { id: true, order: true, createdAt: true } }),
  (id, order) => prisma.skillDiff.update({ where: { id }, data: { order } })
);

await prisma.$disconnect();
console.log("Done.");
