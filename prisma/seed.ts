import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Static data (inlined to avoid import alias issues) ───────────────────────

const projects = [
  {
    slug: "git-portfolio",
    repoName: "git-portfolio",
    description: "A developer portfolio with Git-inspired UI — terminals, branches, and commit logs.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 12,
    forks: 3,
    commits: 47,
    lastCommit: "just now",
    lastCommitMsg: "feat: add command palette with Ctrl+K shortcut",
    tags: ["Next.js", "Tailwind", "Framer Motion"],
    liveUrl: "https://omkarjadhav.vercel.app",
    repoUrl: "https://github.com/omkarjadhav/git-portfolio",
    status: "active",
    pinned: true,
    longDescription: "Built with Next.js 14, this portfolio reimagines personal websites through the lens of Git — commit timelines, branch visualizations, and a fully interactive terminal command palette.",
  },
  {
    slug: "dev-mobiles",
    repoName: "dev-mobiles",
    description: "Mobile shopping e-commerce platform with full auth, cart, search, and purchase flow.",
    language: "PHP",
    languageColor: "#4F5D95",
    stars: 8,
    forks: 2,
    commits: 84,
    lastCommit: "2 months ago",
    lastCommitMsg: "feat: add purchase flow with payment integration",
    tags: ["PHP", "HTML", "CSS", "JavaScript", "MySQL"],
    liveUrl: null,
    repoUrl: "https://github.com/omkarjadhav/dev-mobiles",
    status: "active",
    pinned: true,
    longDescription: "A full-featured mobile shopping platform built during my internship at Dnyanda Solutions. Supports user login, product search, cart management, and a complete purchase flow with payment integration.",
  },
  {
    slug: "crop-recommendation",
    repoName: "crop-recommendation",
    description: "ML-based crop suggestion system using soil and weather data with a real-time farmer UI.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 19,
    forks: 5,
    commits: 62,
    lastCommit: "3 months ago",
    lastCommitMsg: "feat: integrate real-time weather API for dynamic predictions",
    tags: ["Python", "Scikit-learn", "Pandas", "NumPy"],
    liveUrl: null,
    repoUrl: "https://github.com/omkarjadhav/crop-recommendation",
    status: "active",
    pinned: true,
    longDescription: "A machine learning system that recommends optimal crops based on soil composition and real-time weather conditions. Built with Scikit-learn classification models and a clean farmer-friendly UI.",
  },
  {
    slug: "snapsktch",
    repoName: "snapsktch",
    description: "AI-powered text-to-image generator using Hugging Face API and Streamlit.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 14,
    forks: 3,
    commits: 38,
    lastCommit: "4 months ago",
    lastCommitMsg: "chore: update model endpoint to stable-diffusion-xl",
    tags: ["Python", "Streamlit", "Hugging Face", "AI"],
    liveUrl: null,
    repoUrl: "https://github.com/omkarjadhav/snapsktch",
    status: "active",
    pinned: true,
    longDescription: "A text-to-image generation app powered by Hugging Face's diffusion models. Users describe an image in text, and SnapSktch renders it in seconds via Streamlit's interactive UI.",
  },
];

const timeline = [
  {
    hash: "f3a9b1c",
    type: "job",
    title: "Web Developer Intern",
    org: "Dnyanda Solutions Pvt. Ltd.",
    date: "Jul 2022",
    dateEnd: "Sep 2022",
    description: [
      "Developed backend systems using PHP for client e-commerce applications",
      "Built a complete E-commerce platform with user authentication, cart, and payment flow",
      "Collaborated on HTML/CSS frontend for responsive shopping interfaces",
      "Worked with MySQL for product catalogue and order management",
    ],
    branch: "work/dnyanda-solutions",
    branchColor: "#00ff88",
    colorKey: "green",
    tags: ["PHP", "HTML", "CSS", "JavaScript", "MySQL"],
    url: null,
  },
  {
    hash: "a2d8e4f",
    type: "achievement",
    title: "Python Bootcamp Certification",
    org: "Udemy",
    date: "Jan 2023",
    dateEnd: null,
    description: [
      "Completed comprehensive Python programming bootcamp",
      "Covered OOP, file handling, data structures, and web scraping",
    ],
    branch: "cert/python-bootcamp",
    branchColor: "#e3b341",
    colorKey: "yellow",
    tags: ["Python", "Udemy", "Certification"],
    url: null,
  },
  {
    hash: "b5c7f2a",
    type: "achievement",
    title: "Java Programming Certification",
    org: "Udemy",
    date: "Mar 2023",
    dateEnd: null,
    description: [
      "Completed Java programming course covering core Java and OOP principles",
      "Built multiple project applications including a library management system",
    ],
    branch: "cert/java-programming",
    branchColor: "#e3b341",
    colorKey: "yellow",
    tags: ["Java", "OOP", "Udemy", "Certification"],
    url: null,
  },
  {
    hash: "0d3f9e1",
    type: "education",
    title: "B.Tech Computer Science & Engineering (Data Science)",
    org: "KIT College of Engineering, Kolhapur",
    date: "Aug 2023",
    dateEnd: "May 2026",
    description: [
      "SGPA: 8.0/10 — Pursuing specialization in Data Science",
      "Relevant coursework: DSA, OS, DBMS, Computer Networks, Machine Learning",
      "Building projects in ML, full-stack web development, and systems programming",
    ],
    branch: "edu/btech-cse",
    branchColor: "#58a6ff",
    colorKey: "blue",
    tags: ["DSA", "OS", "DBMS", "Machine Learning", "Data Science"],
    url: null,
  },
  {
    hash: "1e2b4c7",
    type: "education",
    title: "Diploma in Computer Engineering",
    org: "ICRE Gargoti",
    date: "Jun 2020",
    dateEnd: "May 2023",
    description: [
      "Graduated with 87% — Top performer in department",
      "Core subjects: C, C++, Java, DBMS, Digital Electronics, Networking",
    ],
    branch: "edu/diploma-cse",
    branchColor: "#58a6ff",
    colorKey: "blue",
    tags: ["C++", "Java", "Networking", "DBMS"],
    url: null,
  },
  {
    hash: "2c3d5e8",
    type: "education",
    title: "SSC (Class X)",
    org: "Dindewadi High School",
    date: "Mar 2020",
    dateEnd: null,
    description: ["Scored 94% — School topper in Mathematics and Science"],
    branch: "edu/high-school",
    branchColor: "#58a6ff",
    colorKey: "blue",
    tags: ["Mathematics", "Science"],
    url: null,
  },
];

const skillBranches = [
  {
    branchName: "feature/web",
    color: "#58a6ff",
    offset: 0,
    skills: [
      { name: "HTML/CSS", level: 5, icon: "🌐", tag: null },
      { name: "JavaScript", level: 4, icon: "JS", tag: null },
      { name: "PHP", level: 4, icon: "🐘", tag: "v8" },
      { name: "React", level: 3, icon: "⚛", tag: null },
      { name: "Next.js", level: 3, icon: "▲", tag: "v14" },
      { name: "Tailwind CSS", level: 3, icon: "🎨", tag: null },
    ],
  },
  {
    branchName: "feature/backend",
    color: "#00ff88",
    offset: 1,
    skills: [
      { name: "Python", level: 4, icon: "🐍", tag: null },
      { name: "Java", level: 3, icon: "☕", tag: null },
      { name: "C++", level: 3, icon: "⚙", tag: null },
      { name: "MySQL", level: 4, icon: "🗄", tag: null },
      { name: "PostgreSQL", level: 3, icon: "🐘", tag: null },
      { name: "MongoDB", level: 3, icon: "🍃", tag: null },
    ],
  },
  {
    branchName: "feature/ml",
    color: "#f0883e",
    offset: 2,
    skills: [
      { name: "NumPy", level: 4, icon: "🔢", tag: null },
      { name: "Pandas", level: 4, icon: "🐼", tag: null },
      { name: "Scikit-learn", level: 3, icon: "🧠", tag: null },
      { name: "Streamlit", level: 3, icon: "📊", tag: null },
      { name: "Jupyter", level: 4, icon: "📓", tag: null },
    ],
  },
  {
    branchName: "feature/tools",
    color: "#d2a8ff",
    offset: 3,
    skills: [
      { name: "Git", level: 5, icon: "⑂", tag: "v2.45" },
      { name: "GitHub", level: 4, icon: "🐙", tag: null },
      { name: "VS Code", level: 5, icon: "💻", tag: null },
      { name: "Postman", level: 4, icon: "📮", tag: null },
    ],
  },
];

const skillDiffs = [
  { name: "TypeScript", type: "added", note: "migrating all JS projects" },
  { name: "Next.js 14 App Router", type: "added", note: "used in this portfolio" },
  { name: "Docker", type: "added", note: "learning containerization" },
  { name: "PostgreSQL", type: "added", note: "replacing MySQL in new projects" },
  { name: "Python", type: "modified", note: "leveling up: async + FastAPI" },
  { name: "React", type: "modified", note: "deepening patterns & performance" },
  { name: "jQuery", type: "deprecated", note: "replaced by React" },
  { name: "Bootstrap", type: "deprecated", note: "replaced by Tailwind CSS" },
];

const profile = {
  name: "Omkar Jadhav",
  handle: "omkarjadhav",
  headline: "B.Tech CSE (Data Science) Student & Full-Stack Developer",
  bio: `I build things for the web and explore the intersection of software and data.\nCurrently pursuing B.Tech in Computer Science (Data Science) at KIT Kolhapur,\nobsessed with clean code, great UX, and systems that scale.\n\nWhen I'm not writing code, I'm experimenting with machine learning models,\nbuilding full-stack apps, or debugging something I broke at 2am.`,
  currentBranch: "main",
  currentStatus: "Open to internships & collaborations",
  availableForWork: true,
  email: "jadhavomkar101103@gmail.com",
  location: "Kolhapur, Maharashtra, India",
  socials: [
    { label: "GitHub", url: "https://github.com/omkarjadhav", icon: "github" },
    { label: "LinkedIn", url: "https://linkedin.com/in/omkarjadhav", icon: "linkedin" },
    { label: "Twitter", url: "https://twitter.com/omkarjadhav", icon: "twitter" },
  ],
  funFacts: [
    "I've written more git commit messages than diary entries",
    "Went from 94% in SSC to building ML models — the plot thickens",
    "I debug in production (just kidding... mostly)",
    "My Hugging Face API calls cost more than my monthly coffee budget",
  ],
  stash: [
    "☕  Coffee-driven development — 3 cups before 10am",
    "♟  Plays chess to debug decision-making",
    "📚  Reading: Designing Data-Intensive Applications (DDIA)",
    "🎵  Codes to lo-fi beats and post-rock",
    "🌱  Contributing to open source, one PR at a time",
  ],
};

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database...");

  // Profile
  await prisma.profile.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      ...profile,
      socials: JSON.stringify(profile.socials),
      funFacts: JSON.stringify(profile.funFacts),
      stash: JSON.stringify(profile.stash),
    },
    update: {
      ...profile,
      socials: JSON.stringify(profile.socials),
      funFacts: JSON.stringify(profile.funFacts),
      stash: JSON.stringify(profile.stash),
    },
  });
  console.log("✓ Profile seeded");

  // Projects
  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      create: { ...p, tags: JSON.stringify(p.tags) },
      update: { ...p, tags: JSON.stringify(p.tags) },
    });
  }
  console.log(`✓ ${projects.length} projects seeded`);

  // Experience
  for (const e of timeline) {
    await prisma.commitEntry.upsert({
      where: { hash: e.hash },
      create: {
        ...e,
        description: JSON.stringify(e.description),
        tags: JSON.stringify(e.tags),
      },
      update: {
        ...e,
        description: JSON.stringify(e.description),
        tags: JSON.stringify(e.tags),
      },
    });
  }
  console.log(`✓ ${timeline.length} experience entries seeded`);

  // Skill branches
  for (const b of skillBranches) {
    const branch = await prisma.skillBranch.upsert({
      where: { branchName: b.branchName },
      create: { branchName: b.branchName, color: b.color, offset: b.offset },
      update: { color: b.color, offset: b.offset },
    });

    for (const s of b.skills) {
      await prisma.skill.upsert({
        where: { branchId_name: { branchId: branch.id, name: s.name } },
        create: { ...s, branchId: branch.id },
        update: { level: s.level, tag: s.tag, icon: s.icon },
      });
    }
  }
  console.log(`✓ ${skillBranches.length} skill branches seeded`);

  // Skill diffs
  for (const d of skillDiffs) {
    await prisma.skillDiff.upsert({
      where: { name: d.name },
      create: d,
      update: d,
    });
  }
  console.log(`✓ ${skillDiffs.length} skill diffs seeded`);

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
