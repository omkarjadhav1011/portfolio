"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "./ToastProvider";

const NAV_ITEMS = [
  { label: "dashboard", path: "/admin", icon: "$" },
  { label: "projects", path: "/admin/projects", icon: "⑂" },
  { label: "experience", path: "/admin/experience", icon: "◉" },
  { label: "skills", path: "/admin/skills", icon: "▲" },
  { label: "profile", path: "/admin/profile", icon: "☰" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast("Logged out", "success");
    router.push("/admin/login");
  }

  return (
    <aside className="w-56 shrink-0 border-r border-terminal-border bg-terminal-surface min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-4 py-5 border-b border-terminal-border">
        <div className="font-mono text-xs text-text-muted mb-0.5">$ git checkout</div>
        <div className="font-mono font-bold text-text-primary text-sm">admin/panel</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.path === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-mono text-xs transition-all duration-150 ${
                isActive
                  ? "bg-git-green/10 text-git-green border border-git-green/20"
                  : "text-text-muted hover:text-text-secondary hover:bg-terminal-border/20 border border-transparent"
              }`}
            >
              <span className={isActive ? "text-git-green" : "text-text-faint"}>{item.icon}</span>
              git checkout {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-terminal-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-xs text-git-red/70 hover:text-git-red hover:bg-git-red/5 border border-transparent hover:border-git-red/20 transition-all duration-150"
        >
          <span>⏻</span>
          git logout
        </button>
        <div className="mt-2 px-3 font-mono text-[10px] text-text-faint">
          HEAD → admin/panel
        </div>
      </div>
    </aside>
  );
}
