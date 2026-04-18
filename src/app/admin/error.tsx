"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] font-mono">
      <div className="max-w-md w-full rounded-xl border border-terminal-border bg-terminal-surface p-8 space-y-4">
        <div className="text-text-faint text-xs">$ git status</div>
        <p className="text-git-red font-bold text-lg">Error in admin panel</p>
        <p className="text-text-muted text-sm">
          {error.message || "An unexpected error occurred."}
        </p>
        {error.digest && (
          <p className="text-text-faint text-xs">Digest: {error.digest}</p>
        )}
        <div className="flex gap-3 pt-2">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg border border-git-green/40 bg-git-green/10 text-git-green text-xs hover:bg-git-green/20 transition-colors"
          >
            Retry
          </button>
          <a
            href="/admin"
            className="px-4 py-2 rounded-lg border border-terminal-border text-text-muted text-xs hover:text-text-primary transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
