"use client";

import { useState } from "react";
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
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40 pointer-events-none" />
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-terminal-bg/60 to-terminal-bg pointer-events-none" />

      <div className="relative w-full max-w-3xl mx-auto space-y-8">
        {/* Terminal boot sequence */}
        <TerminalWindow
          title={`${profile.handle}@portfolio: ~`}
          className="w-full"
        >
          <TypewriterText
            lines={BOOT_LINES}
            startDelay={800}
            onComplete={() => setBootComplete(true)}
            lineColors={{
              0: "text-git-green",
              5: "text-git-green",
              6: "text-git-green",
              8: "text-git-green",
            }}
          />
        </TerminalWindow>

        {/* Name reveal after boot */}
        {bootComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center space-y-4"
          >
            <h1 className="font-mono">
              <span className="block text-text-muted text-sm mb-2 tracking-widest uppercase">
                # {profile.handle}
              </span>
              <span className="block text-4xl md:text-6xl font-bold text-text-primary animate-glow">
                {profile.name}
              </span>
            </h1>

            <p className="text-text-muted font-mono text-sm md:text-base max-w-lg mx-auto">
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
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3 pt-2"
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
            </motion.div>
          </motion.div>
        )}

        {/* Scroll hint */}
        {bootComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center"
          >
            <div className="flex flex-col items-center gap-1 text-text-faint text-xs font-mono animate-bounce">
              <span>scroll</span>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth={2}>
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
