"use client";

import { motion } from "framer-motion";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { profile } from "@/data/profile";

const BOOT_LINES = [
  { text: `$ git clone https://github.com/${profile.handle}/portfolio.git`, delay: 200, speed: 28 },
  { text: "Cloning into 'portfolio'...", delay: 600, speed: 20 },
  { text: "remote: Enumerating objects: 247, done.", delay: 100, speed: 18 },
  { text: "remote: Counting objects: 100% (247/247), done.", delay: 0, speed: 18 },
  { text: "Receiving objects: 100% (247/247), 1.42 MiB | done.", delay: 0, speed: 18 },
  { text: "$ cd portfolio", delay: 500, speed: 40 },
  { text: "$ git log --oneline -1", delay: 300, speed: 40 },
  {
    text: `f3a9b1c (HEAD -> main) feat: ${profile.headline}`,
    delay: 400,
    speed: 22,
  },
  { text: "$ cat README.md", delay: 500, speed: 40 },
];

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40 pointer-events-none" />
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-terminal-bg/60 to-terminal-bg pointer-events-none" />

      <div className="relative w-full max-w-5xl mx-auto">
        {/* Two-column layout: terminal left, name right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left column: terminal boot sequence (decorative, runs freely) */}
          <TerminalWindow
            title={`${profile.handle}@portfolio: ~`}
            className="w-full"
          >
            <TypewriterText
              lines={BOOT_LINES}
              startDelay={800}
              lineColors={{
                0: "text-git-green",
                5: "text-git-green",
                6: "text-git-green",
                8: "text-git-green",
              }}
            />
          </TerminalWindow>

          {/* Right column: name and CTAs — visible immediately on mount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center md:text-left space-y-4"
          >
            <h1 className="font-mono">
              <span className="block text-text-muted text-sm mb-2 tracking-widest uppercase">
                # {profile.handle}
              </span>
              <span
                className="block text-4xl md:text-5xl font-bold text-text-primary"
                style={{ textShadow: "0 0 8px rgba(0,255,136,0.4)" }}
              >
                {profile.name}
              </span>
            </h1>

            <p className="text-text-muted font-mono text-sm md:text-base max-w-lg">
              {profile.headline}
            </p>

            {/* Status badge */}
            {profile.availableForWork && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-git-green/30 bg-git-green/5 text-git-green text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-git-green animate-pulse" />
                {profile.currentStatus}
              </div>
            )}

            {/* CTA Buttons styled as git commands */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center md:justify-start gap-3 pt-2"
            >
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-git-blue/40 bg-git-blue/10 text-git-blue text-sm font-mono hover:bg-git-blue/20 hover:border-git-blue/70 transition-all duration-200"
              >
                <span className="text-text-muted">$</span>
                git checkout projects
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-git-green/40 bg-git-green/10 text-git-green text-sm font-mono hover:bg-git-green/20 hover:border-git-green/70 transition-all duration-200"
              >
                <span className="text-text-muted">$</span>
                git show --contact
              </a>
              {/* NOTE: place your resume at /public/resume.pdf */}
              <a
                href="/resume.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-git-purple/40 bg-git-purple/10 text-git-purple text-sm font-mono hover:bg-git-purple/20 hover:border-git-purple/70 transition-all duration-200"
              >
                <span className="text-text-muted">$</span>
                git export --resume
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll hint — below the grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center mt-12"
        >
          <div className="flex flex-col items-center gap-1 text-text-faint text-xs font-mono animate-float">
            <span>scroll</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth={2}>
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
