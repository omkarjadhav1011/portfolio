# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Git-themed developer portfolio built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Framer Motion. The UI mimics Git concepts (branches, commits, diffs) to present portfolio content. Data layer is Prisma over SQLite — Turso (libSQL) in production via the `@prisma/adapter-libsql` driver adapter, with a local `file:` SQLite fallback. Resend handles contact emails; admin uses cookie-based JWT auth.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Runs `prisma generate && next build`
npm run lint     # ESLint (next lint)
npx prisma db push    # Apply schema changes to SQLite
npx prisma db seed    # Seed via prisma/seed.ts (ts-node, CommonJS)
npx prisma studio     # Browse data in browser
```

`prisma generate` also runs automatically via `postinstall`. There is no test runner configured.

## Architecture

### Routing (`src/app/`)
- `(main)/` — Public portfolio: landing page with all sections, `/projects/[slug]` detail pages
- `admin/` — JWT-protected CRUD dashboard for all content (projects, experience, skills, profile). `src/middleware.ts` gates `/admin/*` by verifying the `admin_token` cookie with a hand-rolled HS256 verifier built on Web Crypto (not `jose`) — this is required because the middleware runs on the Edge runtime where Node `crypto` and bundled Node deps don't load reliably. The login API route (Node runtime) still uses `jose` to **sign** tokens
- `api/` — Route handlers for auth, CRUD operations on each model (experience, profile, projects, skills). Reorder endpoints at `api/admin/reorder` (experience/projects) and `api/admin/stack/reorder` (skill diffs)

### Key Layers
- **Server Actions** (`src/app/actions/`) — Form mutations with Zod validation
- **Prisma models** (`prisma/schema.prisma`) — `Project`, `CommitEntry` (experience), `SkillBranch`/`Skill`/`SkillDiff`, `Profile`. Several models store JSON as strings (`tags`, `description`, `socials`)
- **Zustand store** (`src/store/commandPalette.ts`) — Command palette state with terminal and AI modes
- **Custom hooks** (`src/hooks/`) — `useReorder` for drag-and-drop ordering via `@dnd-kit`, `useTerminal`/`useAI` for command palette modes, `useTableSort` for admin tables
- **Components** — `sections/` are page-level sections (Hero, Projects, Skills, Experience, About, Contact); `ui/` are reusable pieces; `layout/` has nav/footer; `admin/SortableTr.tsx` is the drag-handle row used in admin tables

### Data Patterns
- JSON fields stored as `String` in SQLite, parsed/serialized in application code (`Project.tags`, `CommitEntry.description`/`tags`, `Profile.socials`/`funFacts`/`stash`)
- `SkillBranch` (has `offset`) groups `Skill` records; `SkillDiff` is a separate flat list with an `order` int. `Project` and `CommitEntry` also carry `order` for drag-and-drop sorting; `Skill` itself does not
- `src/lib/prisma.ts` picks the libSQL adapter when `TURSO_DATABASE_URL`+`TURSO_AUTH_TOKEN` are set; otherwise plain Prisma against `DATABASE_URL`. The client is cached on `globalThis` outside production
- Admin validation schemas in `src/lib/admin-validations.ts`, public in `src/lib/validations.ts`
- Password hashing via `bcryptjs`
- Reorder mutations accept `{ ids: string[] }` and bulk-update `order` fields via Prisma `updateMany`

### Environment Variables
See `.env.example`. Required:
- `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` — Turso libSQL connection (production). When both are absent, the app falls back to `DATABASE_URL` (e.g. `file:./prisma/dev.db`)
- `DATABASE_URL` — Local SQLite fallback; also what `prisma` CLI commands (`db push`, `studio`, `db seed`) read against
- `JWT_SECRET` — Admin auth signing/verification key (must match between login route and middleware)
- `ADMIN_PASSWORD_HASH` — Bcrypt hash for admin login
- `RESEND_API_KEY` + `CONTACT_TO_EMAIL` — Contact form delivery

## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore the codebase.**

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
