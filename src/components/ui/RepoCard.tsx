"use client";

import { motion } from "framer-motion";
import { Star, GitFork, ExternalLink, GitCommitHorizontal } from "lucide-react";
import Link from "next/link";
import { LanguageDot } from "./LanguageDot";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface RepoCardProps {
  project: Project;
  index?: number;
}

export function RepoCard({ project, index = 0 }: RepoCardProps) {
  const statusColors: Record<string, string> = {
    active: "text-git-green",
    wip: "text-git-yellow",
    archived: "text-text-muted",
  };

  return (
    <Link href={`/projects/${project.slug}`} className="block group/card">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
        whileHover={{ y: -4 }}
        className={cn(
          "relative flex flex-col gap-3 rounded-xl p-5",
          "bg-terminal-surface border border-terminal-border",
          "hover:border-git-blue/50 hover:shadow-card-hover",
          "transition-all duration-300 cursor-pointer"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-git-blue text-base">📁</span>
            <span className="font-mono font-semibold text-git-blue truncate group-hover/card:underline">
              {project.repoName}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {project.liveUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(project.liveUrl, "_blank", "noopener,noreferrer");
                }}
                className="p-1.5 rounded text-text-muted hover:text-git-green hover:bg-git-green/10 transition-colors"
                title="Live demo"
              >
                <ExternalLink size={14} />
              </button>
            )}
            {project.repoUrl && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(project.repoUrl, "_blank", "noopener,noreferrer");
                }}
                className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-terminal-border/30 transition-colors"
                title="Source code"
              >
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Last commit */}
        <div className="flex items-center gap-1.5 text-xs text-text-faint font-mono bg-terminal-bg/60 rounded px-2 py-1.5 border border-terminal-border/50">
          <GitCommitHorizontal size={12} className="text-git-green shrink-0" />
          <span className="text-git-green/70">{project.id.padStart(7, "0").slice(-7)}</span>
          <span className="truncate">{project.lastCommitMsg}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="tag">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-terminal-border/50">
          <LanguageDot language={project.language} color={project.languageColor} />
          <div className="flex items-center gap-3 text-xs text-text-muted font-mono">
            <span className="flex items-center gap-1">
              <Star size={12} />
              {project.stars}
            </span>
            <span className="flex items-center gap-1">
              <GitFork size={12} />
              {project.forks}
            </span>
            <span className={cn("text-xs", statusColors[project.status])}>
              {project.status}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
