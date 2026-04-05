"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
import { profile } from "@/data/profile";
import { allSkills } from "@/data/skills";

const topSkills = allSkills.filter((s) => s.level >= 4).slice(0, 8);

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          {/* Section header */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-git-green font-mono text-sm">$</span>
            <span className="font-mono text-text-muted text-sm">cat README.md</span>
          </div>
        </ScrollReveal>

        {/* README card */}
        <ScrollReveal delay={0.1}>
          <div className="rounded-xl border border-terminal-border bg-terminal-surface overflow-hidden shadow-terminal">
            {/* README header bar */}
            <div className="flex items-center justify-between px-5 py-3 bg-terminal-bg border-b border-terminal-border">
              <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
                <span className="text-git-orange">📄</span>
                <span>README.md</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-text-faint font-mono">
                <span>Last updated: 2 days ago</span>
                <span>·</span>
                <span>47 commits to this file</span>
              </div>
            </div>

            {/* README body */}
            <div className="p-6 md:p-8 space-y-6 font-mono">
              {/* H1 */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-1">
                  {profile.name}
                </h2>
                <p className="text-git-green text-sm">{profile.headline}</p>
              </div>

              {/* Badges row */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="status">⚡ Available for work</Badge>
                <Badge variant="branch">main</Badge>
                <Badge variant="tag">B.Tech CSE</Badge>
                <Badge variant="tag">Open Source</Badge>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border border-terminal-border bg-terminal-bg text-text-muted">
                  📍 {profile.location}
                </span>
              </div>

              <hr className="border-terminal-border" />

              {/* ## About Me */}
              <div>
                <h3 className="text-git-blue text-lg font-bold mb-3">## About Me</h3>
                <div className="text-text-secondary text-sm leading-7 whitespace-pre-line">
                  {profile.bio}
                </div>
              </div>

              <hr className="border-terminal-border" />

              {/* ## Tech I Know Well */}
              <div>
                <h3 className="text-git-blue text-lg font-bold mb-3">## Tech I Know Well</h3>
                <div className="flex flex-wrap gap-2">
                  {topSkills.map((skill) => (
                    <span
                      key={skill.name}
                      className="px-2.5 py-1 rounded text-xs bg-terminal-bg border border-terminal-border text-text-secondary hover:border-git-green/40 hover:text-git-green transition-colors"
                    >
                      {skill.icon && <span className="mr-1">{skill.icon}</span>}
                      {skill.name}
                      {skill.tag && (
                        <span className="ml-1 text-text-faint">{skill.tag}</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <hr className="border-terminal-border" />

              {/* ## Fun Facts */}
              <div>
                <h3 className="text-git-blue text-lg font-bold mb-3">## Fun Facts</h3>
                <ul className="space-y-2">
                  {profile.funFacts.map((fact, i) => (
                    <li key={i} className="flex gap-2 text-sm text-text-secondary">
                      <span className="text-git-green shrink-0">-</span>
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>

              <hr className="border-terminal-border" />

              {/* ## Connect */}
              <div>
                <h3 className="text-git-blue text-lg font-bold mb-3">## Connect</h3>
                <div className="flex flex-wrap gap-3">
                  {profile.socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-text-muted hover:text-git-blue transition-colors"
                    >
                      <span className="text-git-blue">→</span>
                      {social.label}
                    </a>
                  ))}
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-1.5 text-sm text-text-muted hover:text-git-green transition-colors"
                  >
                    <span className="text-git-green">→</span>
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
