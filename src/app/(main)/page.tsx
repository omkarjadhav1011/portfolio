import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import {
  ProjectsSkeleton,
  SkillsSkeleton,
  ExperienceSkeleton,
  ContactSkeleton,
} from "@/components/ui/Skeleton";
import { prisma } from "@/lib/prisma";
import { profile as staticProfile } from "@/data/profile";
import type { Project, CommitEntry, SkillBranch, SkillDiff, Skill, Profile } from "@/types";

export const revalidate = 60;

const SkillsSection = dynamic(
  () => import("@/components/sections/SkillsSection").then((m) => m.SkillsSection),
  { loading: () => <SkillsSkeleton />, ssr: false }
);

const SkillsDiffSection = dynamic(
  () => import("@/components/sections/SkillsDiffSection").then((m) => m.SkillsDiffSection),
  { loading: () => <SkillsSkeleton />, ssr: false }
);

const ProjectsSection = dynamic(
  () => import("@/components/sections/ProjectsSection").then((m) => m.ProjectsSection),
  { loading: () => <ProjectsSkeleton />, ssr: false }
);

const ExperienceSection = dynamic(
  () => import("@/components/sections/ExperienceSection").then((m) => m.ExperienceSection),
  { loading: () => <ExperienceSkeleton />, ssr: false }
);

const ContactSection = dynamic(
  () => import("@/components/sections/ContactSection").then((m) => m.ContactSection),
  { loading: () => <ContactSkeleton />, ssr: false }
);

async function getPageData() {
  try {
    const [rawProjects, rawProfile, rawBranches, rawDiffs, rawTimeline] = await Promise.all([
      prisma.project.findMany({ orderBy: [{ order: "asc" }, { pinned: "desc" }] }),
      prisma.profile.findUnique({ where: { id: "main" } }),
      prisma.skillBranch.findMany({ include: { skills: true }, orderBy: { offset: "asc" } }),
      prisma.skillDiff.findMany({ orderBy: { order: "asc" } }),
      prisma.commitEntry.findMany({ orderBy: { order: "asc" } }),
    ]);

    const projects: Project[] = rawProjects.map((p) => ({
      ...p,
      tags: JSON.parse(p.tags) as string[],
      liveUrl: p.liveUrl ?? undefined,
      repoUrl: p.repoUrl ?? undefined,
      longDescription: p.longDescription ?? undefined,
      status: p.status as "active" | "archived" | "wip",
    }));

    const profile: Profile = rawProfile
      ? (() => {
          const r = rawProfile as typeof rawProfile & {
            currentRoleEnabled?: boolean | null;
            currentRoleTitle?: string | null;
            currentRoleCompany?: string | null;
            currentRoleMonogram?: string | null;
            currentRoleLogoUrl?: string | null;
            currentRoleUrl?: string | null;
            currentRoleLocation?: string | null;
            currentRoleStarted?: string | null;
            currentRoleTenure?: string | null;
            currentRoleAccent?: string | null;
          };
          return {
            ...r,
            socials: JSON.parse(r.socials),
            funFacts: JSON.parse(r.funFacts),
            stash: r.stash ? JSON.parse(r.stash) : undefined,
            currentRole: r.currentRoleEnabled
              ? {
                  enabled: true,
                  title: r.currentRoleTitle ?? "",
                  company: r.currentRoleCompany ?? "",
                  monogram: r.currentRoleMonogram ?? undefined,
                  logoUrl: r.currentRoleLogoUrl ?? undefined,
                  url: r.currentRoleUrl ?? undefined,
                  location: r.currentRoleLocation ?? undefined,
                  startedAt: r.currentRoleStarted ?? "",
                  tenure: r.currentRoleTenure ?? undefined,
                  accent: r.currentRoleAccent ?? undefined,
                }
              : undefined,
          };
        })()
      : staticProfile;

    const skillBranches: SkillBranch[] = rawBranches.map((b) => ({
      branchName: b.branchName,
      color: b.color,
      offset: b.offset,
      skills: b.skills.map((s) => ({
        name: s.name,
        level: s.level as 1 | 2 | 3 | 4 | 5,
        tag: s.tag ?? undefined,
        icon: s.icon ?? undefined,
      })),
    }));

    const skillsDiff: SkillDiff[] = rawDiffs.map((d) => ({
      name: d.name,
      type: d.type as "added" | "deprecated" | "modified",
      note: d.note ?? undefined,
    }));

    const timeline: CommitEntry[] = rawTimeline.map((e) => ({
      hash: e.hash,
      type: e.type as CommitEntry["type"],
      title: e.title,
      org: e.org,
      date: e.date,
      dateEnd: e.dateEnd ?? undefined,
      description: JSON.parse(e.description) as string[],
      branch: e.branch,
      branchColor: e.branchColor,
      colorKey: (e.colorKey ?? undefined) as CommitEntry["colorKey"],
      tags: e.tags ? JSON.parse(e.tags) as string[] : undefined,
      url: e.url ?? undefined,
    }));

    const topSkills: Skill[] = skillBranches
      .flatMap((b) => b.skills)
      .filter((s) => s.level >= 4)
      .slice(0, 8);

    const githubUrl = profile.socials.find((s) => s.icon === "github")?.url ?? "https://github.com";

    return { projects, profile, skillBranches, skillsDiff, timeline, topSkills, githubUrl };
  } catch {
    // Fallback to static data if DB is not yet seeded
    const { projects: staticProjects } = await import("@/data/projects");
    const { timeline: staticTimeline } = await import("@/data/experience");
    const { skillBranches: staticBranches, skillsDiff: staticDiffs, allSkills } = await import("@/data/skills");
    return {
      projects: staticProjects,
      profile: staticProfile,
      skillBranches: staticBranches,
      skillsDiff: staticDiffs,
      timeline: staticTimeline,
      topSkills: allSkills.filter((s) => s.level >= 4).slice(0, 8),
      githubUrl: staticProfile.socials.find((s) => s.icon === "github")?.url ?? "https://github.com",
    };
  }
}

export default async function Home() {
  const { projects, profile, skillBranches, skillsDiff, timeline, topSkills, githubUrl } =
    await getPageData();

  return (
    <>
      <HeroSection profile={profile} />
      <AboutSection profile={profile} topSkills={topSkills} />
      <SkillsSection skillBranches={skillBranches} />
      <SkillsDiffSection skillsDiff={skillsDiff} />
      <ProjectsSection projects={projects} githubUrl={githubUrl} />
      <ExperienceSection timeline={timeline} />
      <ContactSection />
    </>
  );
}
