"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { RepoCard } from "@/components/ui/RepoCard";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

type Filter = "all" | "active" | "archived" | "wip";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "git ls-repos --all", value: "all" },
  { label: "--filter=active", value: "active" },
  { label: "--filter=wip", value: "wip" },
  { label: "--filter=archived", value: "archived" },
];

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.status === activeFilter);

  return (
    <section id="projects" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-git-green font-mono text-sm">$</span>
            <span className="font-mono text-text-muted text-sm">
              git ls-remote --heads
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-mono text-text-primary mb-2">
            Projects
          </h2>
          <p className="text-text-muted text-sm font-mono mb-8">
            # pinned repositories · {projects.length} total
          </p>
        </ScrollReveal>

        {/* Filter bar */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-8 p-3 rounded-xl border border-terminal-border bg-terminal-surface font-mono text-xs">
            <span className="text-text-muted self-center mr-1">filter:</span>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                  activeFilter === f.value
                    ? "border-git-green/60 bg-git-green/10 text-git-green"
                    : "border-terminal-border text-text-muted hover:border-terminal-border/80 hover:text-text-secondary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project, i) => (
            <RepoCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 font-mono text-text-faint">
            <p className="text-git-orange">warning: no objects found matching filter</p>
            <p className="text-sm mt-2">try a different filter</p>
          </div>
        )}

        {/* More on GitHub link */}
        <ScrollReveal delay={0.2}>
          <div className="mt-10 text-center">
            <a
              href={profile.socials.find((s) => s.icon === "github")?.url ?? "https://github.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-sm text-text-muted hover:text-git-blue transition-colors"
            >
              <span className="text-git-green">→</span>
              View all repositories on GitHub
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
