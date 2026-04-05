import type { SkillBranch } from "@/types";

export const skillBranches: SkillBranch[] = [
  {
    branchName: "feature/web",
    color: "#58a6ff",
    offset: 0,
    skills: [
      { name: "HTML/CSS", level: 5, icon: "🌐" },
      { name: "JavaScript", level: 4, icon: "JS" },
      { name: "PHP", level: 4, tag: "v8", icon: "🐘" },
      { name: "React", level: 3, icon: "⚛" },
      { name: "Next.js", level: 3, tag: "v14", icon: "▲" },
      { name: "Tailwind CSS", level: 3, icon: "🎨" },
    ],
  },
  {
    branchName: "feature/backend",
    color: "#00ff88",
    offset: 1,
    skills: [
      { name: "Python", level: 4, icon: "🐍" },
      { name: "Java", level: 3, icon: "☕" },
      { name: "C++", level: 3, icon: "⚙" },
      { name: "MySQL", level: 4, icon: "🗄" },
      { name: "PostgreSQL", level: 3, icon: "🐘" },
      { name: "MongoDB", level: 3, icon: "🍃" },
    ],
  },
  {
    branchName: "feature/ml",
    color: "#f0883e",
    offset: 2,
    skills: [
      { name: "NumPy", level: 4, icon: "🔢" },
      { name: "Pandas", level: 4, icon: "🐼" },
      { name: "Scikit-learn", level: 3, icon: "🧠" },
      { name: "Streamlit", level: 3, icon: "📊" },
      { name: "Jupyter", level: 4, icon: "📓" },
    ],
  },
  {
    branchName: "feature/tools",
    color: "#d2a8ff",
    offset: 3,
    skills: [
      { name: "Git", level: 5, tag: "v2.45", icon: "⑂" },
      { name: "GitHub", level: 4, icon: "🐙" },
      { name: "VS Code", level: 5, icon: "💻" },
      { name: "Postman", level: 4, icon: "📮" },
    ],
  },
];

export const allSkills = skillBranches.flatMap((b) => b.skills);
