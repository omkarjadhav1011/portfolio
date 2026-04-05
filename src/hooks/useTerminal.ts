"use client";

import { useState, useCallback } from "react";
import type { CommandResult } from "@/types";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillBranches } from "@/data/skills";
import { timeline } from "@/data/experience";

const SECTION_IDS = ["hero", "about", "skills", "projects", "experience", "contact"];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

interface ParsedCommand {
  base: string;       // e.g. "git", "ls", "whoami"
  sub: string;        // e.g. "checkout", "log", "branch"
  args: string[];     // remaining tokens
  flags: string[];    // tokens starting with "-"
  raw: string;
}

function parseCommand(raw: string): ParsedCommand {
  const tokens = raw.trim().split(/\s+/).filter(Boolean);
  const base = tokens[0] ?? "";
  const sub = tokens[1] ?? "";
  const rest = tokens.slice(2);
  const flags = rest.filter((t) => t.startsWith("-"));
  const args = rest.filter((t) => !t.startsWith("-"));
  return { base, sub, args, flags, raw };
}

export function useTerminal() {
  const [history, setHistory] = useState<Array<{ command: string; result: CommandResult }>>([]);
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);

  const executeCommand = useCallback((raw: string): CommandResult => {
    if (!raw.trim()) return { output: [], type: "success" };

    const cmd = parseCommand(raw.toLowerCase());

    // ── clear ──────────────────────────────────────────────────────────────
    if (cmd.base === "clear") {
      setHistory([]);
      return { output: [], type: "success" };
    }

    // ── help ───────────────────────────────────────────────────────────────
    if (cmd.base === "help" || (cmd.base === "git" && cmd.sub === "--help")) {
      return {
        output: [
          "Available commands:",
          "",
          "  Navigation:",
          "    git checkout <section>  — jump to a section",
          "    ls                      — list all sections",
          "",
          "  Info:",
          "    whoami                  — about me",
          "    git log                 — experience timeline",
          "    git status              — current status",
          "    git branch              — skill branches",
          "    skills                  — list all skills",
          "    projects                — list all projects",
          "",
          "  Other:",
          "    theme dark|light        — switch theme",
          "    git --version           — portfolio version",
          "    cat README.md           — about section",
          "    clear                   — clear terminal",
          "",
          "  Tip: use ↑ / ↓ to navigate command history",
        ],
        type: "success",
      };
    }

    // ── whoami / git config user.name ──────────────────────────────────────
    if (
      cmd.base === "whoami" ||
      (cmd.base === "git" && cmd.sub === "config" && cmd.args[0] === "user.name")
    ) {
      setTimeout(() => scrollToSection("about"), 100);
      return {
        output: [
          profile.name,
          `handle: ${profile.handle}`,
          `location: ${profile.location}`,
          `email: ${profile.email}`,
          `status: ${profile.currentStatus}`,
        ],
        type: "success",
      };
    }

    // ── ls ─────────────────────────────────────────────────────────────────
    if (cmd.base === "ls") {
      return {
        output: [
          "drwxr-xr-x  hero/",
          "drwxr-xr-x  about/",
          "drwxr-xr-x  skills/",
          "drwxr-xr-x  projects/",
          "drwxr-xr-x  experience/",
          "drwxr-xr-x  contact/",
          "-rw-r--r--  README.md",
        ],
        type: "success",
      };
    }

    // ── skills ─────────────────────────────────────────────────────────────
    if (cmd.base === "skills") {
      setTimeout(() => scrollToSection("skills"), 100);
      const lines: string[] = ["Skills by branch:", ""];
      for (const branch of skillBranches) {
        lines.push(`  ⑂ ${branch.branchName}`);
        for (const skill of branch.skills) {
          const bar = "█".repeat(skill.level) + "░".repeat(5 - skill.level);
          lines.push(`      ${bar}  ${skill.name}${skill.tag ? ` (${skill.tag})` : ""}`);
        }
        lines.push("");
      }
      return { output: lines, type: "success" };
    }

    // ── projects ───────────────────────────────────────────────────────────
    if (cmd.base === "projects") {
      setTimeout(() => scrollToSection("projects"), 100);
      const lines: string[] = ["Pinned repositories:", ""];
      for (const p of projects) {
        lines.push(`  📁 ${p.repoName}  [${p.language}]`);
        lines.push(`     ${p.description}`);
        lines.push(`     ★ ${p.stars}  ⑂ ${p.forks}  ● ${p.status}`);
        lines.push("");
      }
      return { output: lines, type: "success" };
    }

    // ── theme dark|light ───────────────────────────────────────────────────
    if (cmd.base === "theme") {
      const mode = cmd.sub;
      if (mode === "dark") {
        document.documentElement.classList.add("dark");
        return { output: ["Switched to dark mode."], type: "success" };
      }
      if (mode === "light") {
        document.documentElement.classList.remove("dark");
        return { output: ["Switched to light mode."], type: "success" };
      }
      return {
        output: ["Usage: theme dark | theme light"],
        type: "error",
      };
    }

    // ── cat README.md ──────────────────────────────────────────────────────
    if (cmd.base === "cat" && cmd.sub === "readme.md") {
      setTimeout(() => scrollToSection("about"), 100);
      return { output: ["Opening README.md..."], type: "success" };
    }

    // ── git commands ───────────────────────────────────────────────────────
    if (cmd.base === "git") {
      // git checkout <section>
      if (cmd.sub === "checkout") {
        const target = cmd.args[0]?.replace(/^\//, "");
        if (!target) {
          return {
            output: ["Usage: git checkout <section>", "Sections: " + SECTION_IDS.join(", ")],
            type: "error",
          };
        }
        if (SECTION_IDS.includes(target)) {
          setTimeout(() => scrollToSection(target), 100);
          return {
            output: [`Switched to branch '${target}'`],
            type: "success",
          };
        }
        return {
          output: [
            `error: pathspec '${target}' did not match any known sections`,
            "",
            "Available sections: " + SECTION_IDS.join(", "),
          ],
          type: "error",
        };
      }

      // git log
      if (cmd.sub === "log") {
        setTimeout(() => scrollToSection("experience"), 100);
        const lines = timeline.map(
          (e) => `${e.hash} (${e.branch}) ${e.title} @ ${e.org}`
        );
        lines.push("", "Scrolling to experience...");
        return { output: lines, type: "success" };
      }

      // git status
      if (cmd.sub === "status") {
        return {
          output: [
            `On branch ${profile.currentBranch}`,
            "Your branch is up to date with 'origin/main'.",
            "",
            `nothing to commit, working tree clean`,
            `(${profile.currentStatus})`,
          ],
          type: "success",
        };
      }

      // git branch
      if (cmd.sub === "branch") {
        setTimeout(() => scrollToSection("skills"), 100);
        const lines = [`* ${profile.currentBranch}`, ...skillBranches.map((b) => `  ${b.branchName}`)];
        return { output: lines, type: "success" };
      }

      // git --version
      if (cmd.sub === "--version") {
        return {
          output: ["git version 2.45.0 (portfolio edition)"],
          type: "success",
        };
      }

      // git remote
      if (cmd.sub === "remote") {
        return {
          output: profile.socials.map((s) => `  ${s.label.toLowerCase()}\t${s.url}`),
          type: "success",
        };
      }

      // git show --contact
      if (cmd.sub === "show") {
        setTimeout(() => scrollToSection("contact"), 100);
        return {
          output: [
            `commit ${Date.now().toString(16).slice(-7)} (HEAD -> contact)`,
            `Author: ${profile.name} <${profile.email}>`,
            "",
            "    Open to: " + profile.currentStatus,
          ],
          type: "success",
        };
      }

      return {
        output: [
          `git: '${cmd.sub}' is not a recognized subcommand. See 'help'.`,
        ],
        type: "error",
      };
    }

    // ── unknown ────────────────────────────────────────────────────────────
    return {
      output: [
        `command not found: ${cmd.base}`,
        "",
        "Type 'help' to see available commands.",
      ],
      type: "error",
    };
  }, []);

  const submit = useCallback(
    (command: string) => {
      const result = executeCommand(command);
      if (command.trim().toLowerCase() !== "clear") {
        setHistory((prev) => [...prev, { command, result }]);
      }
      setInput("");
      setHistoryIndex(-1);
    },
    [executeCommand]
  );

  const navigateHistory = useCallback(
    (direction: "up" | "down") => {
      const commands = history.map((h) => h.command).reverse();
      if (direction === "up") {
        const nextIndex = Math.min(historyIndex + 1, commands.length - 1);
        setHistoryIndex(nextIndex);
        setInput(commands[nextIndex] ?? "");
      } else {
        const nextIndex = Math.max(historyIndex - 1, -1);
        setHistoryIndex(nextIndex);
        setInput(nextIndex === -1 ? "" : (commands[nextIndex] ?? ""));
      }
    },
    [history, historyIndex]
  );

  return { history, input, setInput, submit, navigateHistory };
}
