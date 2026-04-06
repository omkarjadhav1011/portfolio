import { prisma } from "@/lib/prisma";
import { ProjectsClient } from "./ProjectsClient";

export default async function ProjectsPage() {
  const raw = await prisma.project.findMany({ orderBy: { pinned: "desc" } });
  const projects = raw.map((p) => ({ ...p, tags: JSON.parse(p.tags) as string[] }));
  return <ProjectsClient initialProjects={projects} />;
}
