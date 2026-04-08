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
  | "follow_up"
  | "unknown";

function detectIntent(input: string, history: AIMessage[]): Intent {
  const q = input.toLowerCase();

  // Detect conversational follow-ups referencing prior context
  if (
    history.length > 0 &&
    /^(more|tell me more|expand|elaborate|continue|yes|yeah|and\??\s*$|what about|the (first|second|third|last) one|that one|both|all of them|go on|keep going|what else)\b/.test(q)
  )
    return "follow_up";
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

// Keyword → intent map used to infer topic from last assistant message
const TOPIC_KEYWORDS: Array<{ pattern: RegExp; intent: Intent }> = [
  { pattern: /skill|stack|tech|language|framework|proficien/i, intent: "skills" },
  { pattern: /project|repo|built|application/i, intent: "projects" },
  { pattern: /experience|career|job|intern|worked/i, intent: "experience" },
  { pattern: /education|degree|college|university|cgpa/i, intent: "education" },
  { pattern: /contact|email|hire|available|opportun/i, intent: "contact" },
  { pattern: /fun|hobbies|interest|stash|outside/i, intent: "fun" },
];

function generateFollowUpResponse(history: AIMessage[]): string {
  const lastAssistant = [...history].reverse().find((m) => m.role === "assistant");
  if (!lastAssistant) {
    return "Could you be more specific? I can go deeper on skills, projects, experience, education, or contact info.";
  }

  const content = lastAssistant.content;
  const matched = TOPIC_KEYWORDS.find(({ pattern }) => pattern.test(content));

  switch (matched?.intent) {
    case "skills": {
      const allSkills = skillBranches.flatMap((b) =>
        b.skills.map((s) => `\`${s.name}\`${s.tag ? ` *(${s.tag})*` : ""}`)
      );
      return `Here's the full skill breakdown across all branches:\n\n${allSkills.join(" · ")}\n\nOmkar is most experienced in full-stack web development and data/ML pipelines.`;
    }
    case "projects": {
      const lines = projects.map(
        (p) =>
          `• **${p.repoName}** \`[${p.language}]\`\n  ${p.description}\n  ★ ${p.stars}  forks: ${p.forks}  status: *${p.status}*`
      );
      return `Here are all of Omkar's projects with full details:\n\n${lines.join("\n\n")}`;
    }
    case "experience": {
      const all = timeline.map(
        (e) =>
          `• **${e.title}** @ ${e.org}\n  ${e.date}${e.dateEnd ? ` → ${e.dateEnd}` : ""}`
      );
      return `Full experience timeline:\n\n${all.join("\n\n")}`;
    }
    case "education": {
      const edu = timeline.filter((e) => e.type === "education");
      const lines = edu.map(
        (e) =>
          `• **${e.title}** — ${e.org}\n  ${e.date}${e.dateEnd ? ` → ${e.dateEnd}` : ""}`
      );
      return `Here's Omkar's complete educational background:\n\n${lines.join("\n\n")}`;
    }
    case "contact":
      return `The best ways to reach Omkar:\n\n📧 \`${profile.email}\`\n📍 ${profile.location}\n\n${profile.socials.map((s) => `• **${s.label}** — ${s.url}`).join("\n")}\n\nOr use the Contact section at the bottom of the page.`;
    case "fun":
      return `Here are all of Omkar's stashed interests:\n\n${(profile.stash ?? []).map((s) => `• ${s}`).join("\n")}`;
    default:
      return "Could you be more specific? I can go deeper on skills, projects, experience, education, or contact info.";
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

    setMessages((prev) => {
      const updatedHistory = [...prev, userMsg];
      setIsTyping(true);

      const intent = detectIntent(userInput, prev);
      const response =
        intent === "follow_up"
          ? generateFollowUpResponse(prev)
          : generateResponse(intent);
      const delay = 500 + Math.random() * 400;

      setTimeout(() => {
        const aiMsg: AIMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: response,
        };
        setMessages((current) => [...current, aiMsg]);
        setIsTyping(false);
      }, delay);

      return updatedHistory;
    });
  }, []);

  const clearChat = useCallback(() => setMessages([]), []);

  return { messages, isTyping, ask, clearChat };
}
