"use client";

import { useState } from "react";
import {
  ChevronRight,
  ExternalLink,
  Folder,
  GitFork,
  GitMerge,
  SearchX,
  Star,
  CheckCircle2,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Project } from "@/types";

type Filter = "all" | "active" | "wip" | "archived";

const STATUS_STYLES: Record<
  Project["status"],
  { label: string; tint: string; glyph: string }
> = {
  active: { label: "Open", tint: "var(--color-git-green)", glyph: "●" },
  wip: { label: "WIP", tint: "var(--color-git-orange)", glyph: "◐" },
  archived: { label: "Archived", tint: "var(--color-text-muted)", glyph: "◌" },
};

interface PRCardProps {
  project: Project;
  index: number;
  handle: string;
}

function PRCard({ project, index, handle }: PRCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [shortlisting, setShortlisting] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);

  const status = STATUS_STYLES[project.status];

  function handleShortlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (shortlisting || shortlisted) return;
    setShortlisting(true);
    setTimeout(() => {
      setShortlisting(false);
      setShortlisted(true);
    }, 1200);
  }

  // Synthesize a tiny diff preview from the lastCommitMsg + first 3 tags
  const previewLines: { type: "context" | "add" | "del"; text: string }[] = [
    { type: "context", text: `// ${project.repoName}` },
    { type: "add", text: `+ ${project.lastCommitMsg}` },
    ...project.tags.slice(0, 2).map(
      (t) => ({ type: "context" as const, text: `  using: ${t}` }),
    ),
  ];

  return (
    <ScrollReveal delay={index * 0.06}>
      <div
        className="group rounded-xl overflow-hidden transition-transform hover:-translate-y-0.5 bg-terminal-surface"
        style={{
          border: shortlisted
            ? "1px solid rgb(var(--color-git-purple) / 0.5)"
            : "1px solid rgb(var(--color-terminal-border))",
          boxShadow: shortlisted
            ? "0 0 0 1px rgb(var(--color-git-purple) / 0.3), 0 0 40px rgb(var(--color-git-purple) / 0.1)"
            : undefined,
        }}
      >
        {/* Status strip */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-terminal-border bg-terminal-bg/50 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            {shortlisted ? (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold"
                style={{
                  background: "rgb(var(--color-git-purple) / 0.15)",
                  color: "rgb(var(--color-git-purple))",
                  border: "1px solid rgb(var(--color-git-purple) / 0.4)",
                }}
              >
                <GitMerge size={10} /> Merged
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold"
                style={{
                  background: `rgb(${status.tint} / 0.12)`,
                  color: `rgb(${status.tint})`,
                  border: `1px solid rgb(${status.tint} / 0.4)`,
                }}
              >
                <span style={{ fontSize: 9 }}>{status.glyph}</span> {status.label}
              </span>
            )}
            <span className="text-text-faint">#{index + 12}</span>
          </div>
          <div className="flex items-center gap-3 text-text-muted">
            <span className="inline-flex items-center gap-1">
              <Star size={11} /> {project.stars}
            </span>
            <span className="inline-flex items-center gap-1">
              <GitFork size={11} /> {project.forks}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-1 font-mono text-xs">
            <Folder size={12} className="text-git-blue" />
            <span className="text-text-muted">{handle}/</span>
            <span className="font-semibold text-git-blue">{project.repoName}</span>
          </div>

          <h3 className="text-lg font-semibold leading-snug mb-2 text-text-primary font-sans">
            {project.lastCommitMsg}
          </h3>

          <p className="text-sm mb-4 leading-relaxed text-text-secondary font-sans">
            {project.description}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-4 mb-3 text-[11px] font-mono text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: project.languageColor }}
              />
              {project.language}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="text-git-green">+{project.commits}</span>
              <span className="text-git-red">−0</span>
            </span>
            <span className="text-text-faint">{project.tags.length} tags</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-terminal-bg/70 border border-terminal-border text-text-muted"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Diff toggle */}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full text-left font-mono text-[11px] flex items-center gap-1.5 hover:brightness-125 mb-3 text-text-muted"
          >
            <ChevronRight
              size={12}
              className="text-git-green transition-transform"
              style={{ transform: expanded ? "rotate(90deg)" : "rotate(0)" }}
            />
            {expanded ? "Hide" : "Show"} diff preview
          </button>

          {expanded && (
            <div className="font-mono text-[11px] overflow-hidden rounded-md mb-3 bg-terminal-bg/70 border border-terminal-border">
              {previewLines.map((line, i) => {
                const styles = {
                  add: {
                    bg: "rgb(var(--color-git-green) / 0.08)",
                    c: "rgb(var(--color-git-green))",
                    g: "+",
                  },
                  del: {
                    bg: "rgb(var(--color-git-red) / 0.08)",
                    c: "rgb(var(--color-git-red))",
                    g: "−",
                  },
                  context: {
                    bg: "transparent",
                    c: "rgb(var(--color-text-muted))",
                    g: " ",
                  },
                }[line.type];
                return (
                  <div
                    key={i}
                    className="flex gap-3 px-3 py-0.5"
                    style={{ background: styles.bg }}
                  >
                    <span
                      className="w-5 text-right"
                      style={{ color: "rgb(var(--color-text-faint))" }}
                    >
                      {i + 1}
                    </span>
                    <span className="w-2.5" style={{ color: styles.c }}>
                      {styles.g}
                    </span>
                    <span style={{ color: styles.c }}>
                      {line.text.replace(/^[+−\-]\s?/, "")}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-terminal-border">
            <a
              href={project.repoUrl || `https://github.com/${handle}/${project.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs font-semibold transition-colors bg-terminal-bg/70 border border-terminal-border text-text-primary hover:border-git-blue/50"
            >
              <ExternalLink size={11} /> View Source
            </a>
            <button
              type="button"
              onClick={handleShortlist}
              disabled={shortlisted || shortlisting}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs font-semibold transition-colors disabled:cursor-default"
              style={{
                background: shortlisted
                  ? "rgb(var(--color-git-purple) / 0.2)"
                  : "rgb(var(--color-git-green) / 0.15)",
                border: shortlisted
                  ? "1px solid rgb(var(--color-git-purple) / 0.5)"
                  : "1px solid rgb(var(--color-git-green) / 0.5)",
                color: shortlisted
                  ? "rgb(var(--color-git-purple))"
                  : "rgb(var(--color-git-green))",
              }}
            >
              {shortlisted ? (
                <>
                  <CheckCircle2 size={12} /> Shortlisted
                </>
              ) : shortlisting ? (
                <>Merging…</>
              ) : (
                <>
                  <GitMerge size={12} /> Shortlist
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

interface ProjectsSectionProps {
  projects: Project[];
  githubUrl: string;
}

export function ProjectsSection({ projects, githubUrl }: ProjectsSectionProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const handle = (() => {
    const m = /github\.com\/([^/]+)/i.exec(githubUrl);
    return m?.[1] ?? "you";
  })();

  const filters: { k: Filter; label: string; count: number }[] = [
    { k: "all", label: "All", count: projects.length },
    {
      k: "active",
      label: "Open",
      count: projects.filter((p) => p.status === "active").length,
    },
    {
      k: "wip",
      label: "WIP",
      count: projects.filter((p) => p.status === "wip").length,
    },
    {
      k: "archived",
      label: "Archived",
      count: projects.filter((p) => p.status === "archived").length,
    },
  ];

  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);

  return (
    <section id="projects" className="py-16 sm:py-24 px-4 scroll-mt-14">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-3 font-mono text-sm text-text-muted">
            <span className="text-git-green">$</span>
            <span>gh pr list --state=open</span>
          </div>
          <h2 className="font-mono font-bold text-3xl sm:text-4xl md:text-5xl mb-2 text-text-primary">
            Projects
          </h2>
          <p className="text-text-muted text-sm font-sans mb-6">
            each project as a pull request — review, peek the diff, shortlist your favorites
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <div className="flex flex-wrap items-center gap-2 mb-6 p-1.5 rounded-xl bg-terminal-surface border border-terminal-border">
            {filters.map((f) => {
              const active = filter === f.k;
              return (
                <button
                  key={f.k}
                  type="button"
                  onClick={() => setFilter(f.k)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs font-medium transition-colors"
                  style={{
                    background: active ? "rgb(var(--color-git-green) / 0.15)" : "transparent",
                    border: `1px solid ${
                      active ? "rgb(var(--color-git-green) / 0.45)" : "transparent"
                    }`,
                    color: active
                      ? "rgb(var(--color-git-green))"
                      : "rgb(var(--color-text-muted))",
                  }}
                >
                  {f.label}
                  <span
                    className="px-1.5 rounded-full text-[10px]"
                    style={{
                      background: active
                        ? "rgb(var(--color-git-green) / 0.2)"
                        : "rgb(var(--color-terminal-bg) / 0.7)",
                      color: active
                        ? "rgb(var(--color-git-green))"
                        : "rgb(var(--color-text-faint))",
                    }}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
            <span className="ml-auto px-2 font-mono text-[11px] text-text-faint">
              showing {filtered.length} of {projects.length}
            </span>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((p, i) => (
            <PRCard key={p.id} project={p} index={i} handle={handle} />
          ))}
        </div>

        {filtered.length === 0 && (
          <EmptyState
            icon={<SearchX size={32} />}
            title="warning: no objects found matching filter"
            description="try a different filter or view all repositories"
          />
        )}

        <ScrollReveal delay={0.2}>
          <div className="mt-10 text-center">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-sm text-text-muted hover:text-git-blue transition-colors"
            >
              <span className="text-git-green">→</span>
              View all repositories on GitHub
              <ExternalLink size={12} className="opacity-40" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
