"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast("Logged out", "success");
    router.push("/admin/login");
  }

  const navContent = (
    <>
      {/* Header */}
      <div className="px-4 py-5 border-b border-terminal-border flex items-center justify-between">
        <div>
          <div className="font-mono text-xs text-text-muted mb-0.5">$ git checkout</div>
          <div className="font-mono font-bold text-text-primary text-sm">admin/panel</div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-text-muted hover:text-text-primary transition-colors"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
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
              onClick={() => setMobileOpen(false)}
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
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg border border-terminal-border bg-terminal-surface text-text-muted hover:text-text-primary transition-colors"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-terminal-surface border-r border-terminal-border flex flex-col transform transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-terminal-border bg-terminal-surface min-h-screen flex-col">
        {navContent}
      </aside>
    </>
  );
}
