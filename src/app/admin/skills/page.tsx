import { prisma } from "@/lib/prisma";
import { SkillsClient } from "./SkillsClient";

export default async function SkillsPage() {
  const [branches, diffs] = await Promise.all([
    prisma.skillBranch.findMany({ include: { skills: true }, orderBy: { offset: "asc" } }),
    prisma.skillDiff.findMany({ orderBy: { order: "asc" } }),
  ]);
  return <SkillsClient initialBranches={branches} initialDiffs={diffs} />;
}
