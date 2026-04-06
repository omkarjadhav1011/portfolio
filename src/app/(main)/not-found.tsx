import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full font-mono">
        <div className="rounded-xl border border-terminal-border bg-terminal-surface overflow-hidden shadow-terminal">
          {/* Terminal chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3 bg-terminal-bg border-b border-terminal-border">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-xs text-text-faint">portfolio terminal</span>
          </div>

          <div className="p-8 space-y-3">
            <p className="text-text-muted text-sm">
              <span className="text-git-green">$</span>{" "}
              <span className="text-text-primary">git checkout this-page</span>
            </p>
            <p className="text-git-red font-bold">
              fatal: branch &apos;this-page&apos; not found
            </p>
            <p className="text-text-muted text-sm">
              error: pathspec &apos;this-page&apos; did not match any file(s) known to git
            </p>
            <p className="text-text-muted text-sm">
              <span className="text-git-orange">hint:</span> Did you forget to{" "}
              <span className="text-git-green">git fetch</span>?
            </p>
            <p className="text-text-muted text-sm">
              error: Could not find remote ref{" "}
              <span className="text-git-orange">404</span>
            </p>

            <div className="pt-4 border-t border-terminal-border">
              <p className="text-text-faint text-xs mb-4">
                # Available branches — did you mean one of these?
              </p>
              <div className="space-y-2">
                {[
                  { href: "/", label: "git checkout main", desc: "→ home" },
                  { href: "/#about", label: "git checkout about", desc: "→ about me" },
                  { href: "/#projects", label: "git checkout projects", desc: "→ my work" },
                  { href: "/#contact", label: "git checkout contact", desc: "→ get in touch" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 text-sm text-text-muted hover:text-git-green transition-colors group"
                  >
                    <span className="text-git-green">⑂</span>
                    <span className="group-hover:underline">{link.label}</span>
                    <span className="text-text-faint text-xs">{link.desc}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <p className="text-text-faint text-xs">
                # or press{" "}
                <kbd className="px-1.5 py-0.5 rounded border border-terminal-border text-text-muted bg-terminal-bg">
                  Ctrl+K
                </kbd>{" "}
                to open the terminal
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
