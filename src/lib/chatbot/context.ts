import "server-only";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// ─── Zod schemas for parsed JSON-string columns ────────────────────────────

const stringArraySchema = z.array(z.string()).default([]);

const socialLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
  icon: z.string().optional(),
});

// ─── Public types ──────────────────────────────────────────────────────────

export interface PortfolioContext {
  profile: {
    name: string;
    handle: string;
    headline: string;
    bio: string;
    currentBranch: string;
    currentStatus: string;
    availableForWork: boolean;
    email: string;
    location: string;
    socials: z.infer<typeof socialLinkSchema>[];
    funFacts: string[];
    stash: string[];
  };
  projects: {
    slug: string;
    repoName: string;
    description: string;
    longDescription: string | null;
    language: string;
    tags: string[];
    stars: number;
    forks: number;
    commits: number;
    status: string;
    pinned: boolean;
    liveUrl: string | null;
    repoUrl: string | null;
    lastCommit: string;
    lastCommitMsg: string;
  }[];
  experience: {
    type: string;
    title: string;
    org: string;
    date: string;
    dateEnd: string | null;
    description: string[];
    tags: string[];
    branch: string;
    url: string | null;
  }[];
  skillBranches: {
    branchName: string;
    skills: { name: string; level: number; tag: string | null }[];
  }[];
  skillDiff: { name: string; type: string; note: string | null }[];
}

// ─── In-memory cache (per server instance, 60s TTL) ────────────────────────

const TTL_MS = 60_000;
let cache: { data: PortfolioContext; expiresAt: number } | null = null;

function safeParseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    return stringArraySchema.parse(JSON.parse(raw));
  } catch {
    return [];
  }
}

function safeParseSocials(raw: string): z.infer<typeof socialLinkSchema>[] {
  try {
    return z.array(socialLinkSchema).parse(JSON.parse(raw));
  } catch {
    return [];
  }
}

export async function getPortfolioContext(): Promise<PortfolioContext> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) return cache.data;

  const [profile, projects, experience, skillBranches, skillDiff] =
    await Promise.all([
      prisma.profile.findUnique({ where: { id: "main" } }),
      prisma.project.findMany({
        orderBy: [{ pinned: "desc" }, { order: "asc" }],
      }),
      prisma.commitEntry.findMany({ orderBy: { order: "asc" } }),
      prisma.skillBranch.findMany({
        include: { skills: { orderBy: { name: "asc" } } },
        orderBy: { offset: "asc" },
      }),
      prisma.skillDiff.findMany({ orderBy: { order: "asc" } }),
    ]);

  if (!profile) {
    throw new Error("Profile row missing — cannot build chatbot context");
  }

  const data: PortfolioContext = {
    profile: {
      name: profile.name,
      handle: profile.handle,
      headline: profile.headline,
      bio: profile.bio,
      currentBranch: profile.currentBranch,
      currentStatus: profile.currentStatus,
      availableForWork: profile.availableForWork,
      email: profile.email,
      location: profile.location,
      socials: safeParseSocials(profile.socials),
      funFacts: safeParseJsonArray(profile.funFacts),
      stash: safeParseJsonArray(profile.stash),
    },
    projects: projects.map((p) => ({
      slug: p.slug,
      repoName: p.repoName,
      description: p.description,
      longDescription: p.longDescription,
      language: p.language,
      tags: safeParseJsonArray(p.tags),
      stars: p.stars,
      forks: p.forks,
      commits: p.commits,
      status: p.status,
      pinned: p.pinned,
      liveUrl: p.liveUrl,
      repoUrl: p.repoUrl,
      lastCommit: p.lastCommit,
      lastCommitMsg: p.lastCommitMsg,
    })),
    experience: experience.map((e) => ({
      type: e.type,
      title: e.title,
      org: e.org,
      date: e.date,
      dateEnd: e.dateEnd,
      description: safeParseJsonArray(e.description),
      tags: safeParseJsonArray(e.tags),
      branch: e.branch,
      url: e.url,
    })),
    skillBranches: skillBranches.map((b) => ({
      branchName: b.branchName,
      skills: b.skills.map((s) => ({
        name: s.name,
        level: s.level,
        tag: s.tag,
      })),
    })),
    skillDiff: skillDiff.map((d) => ({
      name: d.name,
      type: d.type,
      note: d.note,
    })),
  };

  cache = { data, expiresAt: now + TTL_MS };
  return data;
}

export function __resetPortfolioContextCache() {
  cache = null;
}
