"use client";

import { useState, useCallback } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillBranches } from "@/data/skills";
import { timeline } from "@/data/experience";

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

type Intent =
  | "greeting"
  | "about"
  | "name"
  | "skills"
  | "projects"
  | "experience"
  | "contact"
  | "location"
  | "education"
  | "fun"
  | "facts"
  | "commands"
  | "unknown";

function detectIntent(input: string): Intent {
  const q = input.toLowerCase();
  if (/^(hi|hey|hello|howdy|sup|yo|good\s*(morning|afternoon|evening))\b/.test(q))
    return "greeting";
  if (/\bname\b/.test(q) && !/project|skill/.test(q)) return "name";
  if (/who are you|about (you|him)|tell me|introduce|yourself/.test(q))
    return "about";
  if (/\b(skill|tech|stack|know|use|language|framework|tool|proficien|expert)\b/.test(q))
    return "skills";
  if (/\b(project|build|built|made|repo|portfolio|work on|app|application)\b/.test(q))
    return "projects";
  if (/\b(experience|background|career|worked|job|history|intern|resume|cv)\b/.test(q))
    return "experience";
  if (/\b(contact|email|reach|hire|available|opportun|connect|collab|work with)\b/.test(q))
    return "contact";
  if (/\b(location|where|city|country|live|based|from|timezone)\b/.test(q))
    return "location";
  if (/\b(stud|education|degree|college|university|school|cgpa|gpa|qualification)\b/.test(q))
    return "education";
  if (/\b(fun|hobbies|interest|outside|free time|personal|hobby|besides)\b/.test(q))
    return "fun";
  if (/\b(fact|random|surprise|tell me something different|easter)\b/.test(q))
    return "facts";
  if (/\b(command|terminal|help|type|how (do|can) i)\b/.test(q))
    return "commands";
  return "unknown";
}

function generateResponse(intent: Intent): string {
  switch (intent) {
    case "greeting":
      return `Hey there! I'm here to answer anything about **${profile.name}** — his skills, projects, background, and more.\n\nWhat would you like to know?`;

    case "name":
      return `His name is **${profile.name}**. He goes by the handle \`${profile.handle}\` online.`;

    case "about":
      return `**${profile.name}** is a ${profile.headline}.\n\n${profile.bio.split("\n")[0]}\n\n**Status:** ${profile.currentStatus}\n**Location:** ${profile.location}`;

    case "skills": {
      const lines = skillBranches.map((b) => {
        const names = b.skills.slice(0, 5).map((s) => s.name).join(", ");
        const more = b.skills.length > 5 ? ` +${b.skills.length - 5} more` : "";
        return `**${b.branchName}:** ${names}${more}`;
      });
      return `Here's what Omkar works with:\n\n${lines.join("\n")}\n\nHe's strongest in full-stack web development and data/ML pipelines.`;
    }

    case "projects": {
      const top = projects.slice(0, 4);
      const lines = top.map(
        (p) => `• **${p.repoName}** — ${p.description} \`[${p.language}]\``
      );
      return `Some of Omkar's notable projects:\n\n${lines.join("\n")}\n\nSwitch to Terminal and type \`projects\` to see all with live stats.`;
    }

    case "experience": {
      const work = timeline
        .filter((e) => e.type === "job" || e.type === "achievement")
        .slice(0, 3);
      const lines = work.map(
        (e) =>
          `• **${e.title}** @ ${e.org} (${e.date}${e.dateEnd ? ` → ${e.dateEnd}` : ""})`
      );
      return `Omkar's key experience:\n\n${lines.join("\n")}\n\nType \`git log\` in Terminal for the full timeline with details.`;
    }

    case "contact":
      return `Omkar is currently **${profile.currentStatus}**.\n\n📧 \`${profile.email}\`\n📍 ${profile.location}\n\nYou can also reach him via the Contact section below, or connect on LinkedIn.`;

    case "location":
      return `Omkar is based in **${profile.location}**. He's open to remote opportunities worldwide.`;

    case "education": {
      const edu = timeline.filter((e) => e.type === "education");
      const lines = edu.map(
        (e) =>
          `• **${e.title}** — ${e.org}\n  ${e.date}${e.dateEnd ? ` → ${e.dateEnd}` : ""}`
      );
      return `Omkar's educational background:\n\n${lines.join("\n\n")}`;
    }

    case "fun":
      return `Outside of coding, Omkar:\n\n${(profile.stash ?? []).map((s) => `${s}`).join("\n")}`;

    case "facts": {
      const fact =
        profile.funFacts[Math.floor(Math.random() * profile.funFacts.length)];
      return `Here's a fun fact:\n\n*"${fact}"*`;
    }

    case "commands":
      return `Switch to the **Terminal** tab and try:\n\n• \`help\` — see all available commands\n• \`git checkout <section>\` — navigate the page\n• \`git log\` — view full experience timeline\n• \`git stash pop\` — discover hidden interests\n• \`projects\` — list all repos with stats\n• \`whoami\` — profile snapshot`;

    default:
      return `I can tell you about Omkar's **skills**, **projects**, **experience**, **contact** info, or **educational background**. Try asking one of those — or click a suggestion above!`;
  }
}

export function useAI() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const ask = useCallback((userInput: string) => {
    if (!userInput.trim()) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userInput.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const intent = detectIntent(userInput);
    const response = generateResponse(intent);
    const delay = 500 + Math.random() * 400;

    setTimeout(() => {
      const aiMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  }, []);

  const clearChat = useCallback(() => setMessages([]), []);

  return { messages, isTyping, ask, clearChat };
}
