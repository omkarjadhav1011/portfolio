"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
import { timeline } from "@/data/experience";
import { formatDateRange } from "@/lib/utils";

const TYPE_ICONS: Record<string, string> = {
  job: "💼",
  education: "🎓",
  achievement: "🏆",
  project: "📁",
};

export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 px-4 bg-terminal-surface/30">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-git-green font-mono text-sm">$</span>
            <span className="font-mono text-text-muted text-sm">
              git log --graph --all --pretty=format:&quot;%h %s&quot;
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-mono text-text-primary mb-2">
            Experience & Education
          </h2>
          <p className="text-text-muted text-sm font-mono mb-12">
            # commit history of my professional journey
          </p>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative">
          {timeline.map((entry, i) => (
            <CommitEntry key={entry.hash} entry={entry} index={i} isLast={i === timeline.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CommitEntry({
  entry,
  index,
  isLast,
}: {
  entry: (typeof timeline)[0];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="relative flex gap-0">
      {/* Left: graph rail */}
      <div className="flex flex-col items-center mr-4 w-8 shrink-0">
        {/* Vertical line above */}
        {index > 0 && (
          <motion.div
            className="w-px"
            style={{ backgroundColor: entry.branchColor, height: 24, opacity: 0.4 }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.3, delay: index * 0.08 }}
          />
        )}

        {/* Commit dot */}
        <motion.div
          className="relative z-10 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
          style={{
            borderColor: entry.branchColor,
            backgroundColor: `${entry.branchColor}25`,
          }}
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: index * 0.08 + 0.1, type: "spring" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: entry.branchColor }}
          />
        </motion.div>

        {/* Vertical line below */}
        {!isLast && (
          <motion.div
            className="w-px flex-1 mt-0"
            style={{ backgroundColor: entry.branchColor, opacity: 0.3 }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.08 + 0.2 }}
          />
        )}
      </div>

      {/* Right: commit content */}
      <motion.div
        className="flex-1 pb-10"
        initial={{ opacity: 0, x: -16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4, delay: index * 0.08 + 0.15 }}
      >
        {/* Commit header */}
        <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-xs text-text-faint">
          <span style={{ color: entry.branchColor }}>{entry.hash}</span>
          <span
            className="px-1.5 py-0.5 rounded border text-[10px]"
            style={{
              borderColor: `${entry.branchColor}40`,
              color: entry.branchColor,
              backgroundColor: `${entry.branchColor}10`,
            }}
          >
            {entry.branch}
          </span>
          <span>{formatDateRange(entry.date, entry.dateEnd)}</span>
        </div>

        {/* Commit card */}
        <div className="rounded-xl border border-terminal-border bg-terminal-surface p-5 hover:border-terminal-border/80 transition-colors">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-xl">{TYPE_ICONS[entry.type]}</span>
            <div>
              <h3 className="font-mono font-bold text-text-primary text-base">
                {entry.title}
              </h3>
              <p className="text-sm font-mono" style={{ color: entry.branchColor }}>
                @ {entry.org}
              </p>
            </div>
          </div>

          {/* Commit body — bullet points */}
          <ul className="space-y-1.5 mb-4 font-mono">
            {entry.description.map((line, li) => (
              <li key={li} className="flex gap-2 text-sm text-text-secondary">
                <span className="text-text-faint shrink-0">│</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          {/* Tags */}
          {entry.tags && (
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="tag">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
