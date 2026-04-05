"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  { id: "about", label: "about" },
  { id: "skills", label: "skills" },
  { id: "projects", label: "projects" },
  { id: "experience", label: "log" },
  { id: "contact", label: "contact" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Navbar() {
  const { progress, activeSection } = useScrollProgress();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-terminal-bg/80 backdrop-blur-md border-b border-terminal-border">
        {/* Scroll progress bar */}
        <div className="absolute bottom-0 left-0 h-px bg-terminal-border w-full">
          <motion.div
            className="h-full bg-git-green"
            style={{ width: `${progress}%` }}
            transition={{ type: "tween", duration: 0.1 }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo / branch indicator */}
          <button
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-2 font-mono text-sm hover:opacity-80 transition-opacity"
          >
            <span className="text-git-green font-bold">⑂</span>
            <span className="text-text-primary font-semibold">{profile.handle}</span>
            <span className="text-text-faint">/</span>
            <span className="text-git-blue">{profile.currentBranch}</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 font-mono text-sm">
            {NAV_SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-all duration-200",
                  activeSection === s.id
                    ? "text-git-green bg-git-green/10 border border-git-green/30"
                    : "text-text-muted hover:text-text-primary hover:bg-terminal-surface"
                )}
              >
                {activeSection === s.id && (
                  <span className="mr-1 text-git-green">*</span>
                )}
                {s.label}
              </button>
            ))}
          </div>

          {/* Ctrl+K hint + mobile toggle */}
          <div className="flex items-center gap-3">
            <span className="hidden lg:flex items-center gap-1 px-2 py-1 rounded border border-terminal-border text-text-faint font-mono text-xs">
              <kbd>Ctrl</kbd>
              <span>+</span>
              <kbd>K</kbd>
            </span>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-text-muted hover:text-text-primary transition-colors p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <div className="space-y-1 w-5">
                <span className={cn("block h-px bg-current transition-all", mobileOpen && "rotate-45 translate-y-1.5")} />
                <span className={cn("block h-px bg-current transition-all", mobileOpen && "opacity-0")} />
                <span className={cn("block h-px bg-current transition-all", mobileOpen && "-rotate-45 -translate-y-1.5")} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-14 left-0 right-0 z-40 bg-terminal-bg border-b border-terminal-border p-4 font-mono space-y-1 md:hidden"
          >
            {NAV_SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => { scrollTo(s.id); setMobileOpen(false); }}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg text-sm transition-colors",
                  activeSection === s.id
                    ? "text-git-green bg-git-green/10"
                    : "text-text-muted hover:text-text-primary hover:bg-terminal-surface"
                )}
              >
                <span className="text-text-faint mr-3">$</span>
                git checkout {s.id}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
