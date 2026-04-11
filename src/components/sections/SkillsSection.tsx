"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { skillLevelLabel } from "@/lib/utils";
import type { Skill, SkillBranch } from "@/types";

// Colors now come from branch.color prop — no hardcoded fallback needed

interface SkillNodeProps {
  skill: Skill;
  color: string;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function SkillNode({ skill, color, index, isHovered, onHover, onLeave }: SkillNodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      className="relative"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div
        className="group flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono cursor-default transition-all duration-200"
        style={{
          borderColor: isHovered ? color : `${color}40`,
          backgroundColor: isHovered ? `${color}20` : `${color}08`,
          color: isHovered ? color : "#c9d1d9",
          boxShadow: isHovered ? `0 0 12px ${color}30` : "none",
        }}
      >
        {skill.icon && <span className="text-sm">{skill.icon}</span>}
        <span>{skill.name}</span>
        {skill.tag && (
          <span
            className="text-[10px] px-1 py-0.5 rounded"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {skill.tag}
          </span>
        )}
      </div>

      {/* Tooltip — rendered only when hovered (state lifted to section) */}
      {isHovered && (
        <div className="absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 z-10 pointer-events-none">
          <div className="bg-terminal-window border border-terminal-border rounded-lg px-3 py-2 text-xs font-mono whitespace-nowrap shadow-terminal">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: i < skill.level ? color : "#30363d" }}
                  />
                ))}
              </div>
              <span style={{ color }}>{skillLevelLabel(skill.level)}</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

interface SkillsSectionProps {
  skillBranches: SkillBranch[];
}

export function SkillsSection({ skillBranches }: SkillsSectionProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <section id="skills" className="py-16 sm:py-24 px-4 scroll-mt-14 bg-terminal-surface/30">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-git-green font-mono text-sm">$</span>
            <span className="font-mono text-text-muted text-sm">git branch -a --verbose</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-mono text-text-primary mb-2">
            Skills
          </h2>
          <p className="text-text-muted text-sm font-mono mb-12">
            # each branch = a domain · each node = a skill · brightness = proficiency
          </p>
        </ScrollReveal>

        {/* Branch graph */}
        <div className="space-y-0">
          {/* main branch rail */}
          <ScrollReveal delay={0.1}>
            <div className="flex items-center gap-4 mb-6 font-mono text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full border-2"
                  style={{ borderColor: "#e6edf3", backgroundColor: "#e6edf3" }}
                />
                <span className="font-bold text-text-primary">* main</span>
              </div>
              <span className="text-text-faint">HEAD → always learning</span>
            </div>
          </ScrollReveal>

          {skillBranches.map((branch, bi) => (
            <ScrollReveal key={branch.branchName} delay={0.15 + bi * 0.1}>
              <div className="relative flex gap-0 mb-6">
                {/* Left rail: the branch graph */}
                <div className="flex flex-col items-center mr-3 sm:mr-4 pt-1">
                  <div
                    className="w-px h-3 mb-1"
                    style={{ backgroundColor: branch.color }}
                  />
                  <div
                    className="w-3 h-3 rounded-full border-2 shrink-0 z-10"
                    style={{ borderColor: branch.color, backgroundColor: `${branch.color}30` }}
                  />
                  <div
                    className="w-px flex-1 mt-1 opacity-30"
                    style={{ backgroundColor: branch.color }}
                  />
                </div>

                {/* Branch content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="font-mono text-sm font-semibold"
                      style={{ color: branch.color }}
                    >
                      ⑂ {branch.branchName}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {branch.skills.map((skill, si) => (
                      <SkillNode
                        key={skill.name}
                        skill={skill}
                        color={branch.color}
                        index={bi * 10 + si}
                        isHovered={hoveredSkill === skill.name}
                        onHover={() => setHoveredSkill(skill.name)}
                        onLeave={() => setHoveredSkill(null)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Legend */}
        <ScrollReveal delay={0.6}>
          <div className="mt-8 p-3 sm:p-4 rounded-xl border border-terminal-border bg-terminal-surface font-mono text-xs text-text-faint overflow-x-auto">
            <span className="text-text-muted">Proficiency: </span>
            {["Learning", "Familiar", "Proficient", "Advanced", "Expert"].map((label, i) => (
              <span key={label} className="mr-3">
                <span className="inline-flex gap-0.5 mr-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span
                      key={j}
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{ backgroundColor: j <= i ? "#00ff88" : "#30363d" }}
                    />
                  ))}
                </span>
                {label}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
