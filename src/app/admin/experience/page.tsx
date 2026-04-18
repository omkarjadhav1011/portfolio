import { prisma } from "@/lib/prisma";
import { ExperienceClient } from "./ExperienceClient";

export default async function ExperiencePage() {
  const raw = await prisma.commitEntry.findMany({ orderBy: { order: "asc" } });
  const entries = raw.map((e) => ({
    ...e,
    description: JSON.parse(e.description) as string[],
    tags: e.tags ? JSON.parse(e.tags) as string[] : [],
  }));
  return <ExperienceClient initialEntries={entries} />;
}
