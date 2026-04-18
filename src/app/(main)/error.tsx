"use client";

import { useEffect } from "react";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full font-mono">
        <div className="rounded-xl border border-terminal-border bg-terminal-surface overflow-hidden shadow-terminal">
          <div className="flex items-center gap-1.5 px-4 py-3 bg-terminal-bg border-b border-terminal-border">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-xs text-text-faint">portfolio terminal</span>
          </div>

          <div className="p-8 space-y-3">
            <p className="text-text-muted text-sm">
              <span className="text-git-green">$</span>{" "}
              <span className="text-text-primary">npm start</span>
            </p>
            <p className="text-git-red font-bold">
              Error: Something went wrong
            </p>
            <p className="text-text-muted text-sm">
              This page ran into an unexpected error. Try refreshing.
            </p>

            <div className="pt-4 border-t border-terminal-border space-y-3">
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-git-green/40 bg-git-green/10 text-git-green text-sm hover:bg-git-green/20 transition-colors"
              >
                <span className="text-text-muted">$</span>
                git reset --soft HEAD~1
              </button>
              <a
                href="/"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-git-green transition-colors"
              >
                <span className="text-git-green">⑂</span>
                git checkout main
                <span className="text-text-faint text-xs">→ home</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
