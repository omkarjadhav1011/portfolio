"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Login failed");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-terminal-bg px-4">
      <div className="w-full max-w-sm">
        {/* Terminal header */}
        <div className="rounded-xl border border-terminal-border bg-terminal-surface overflow-hidden shadow-terminal">
          <div className="flex items-center gap-1.5 px-4 py-3 bg-terminal-bg border-b border-terminal-border">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-xs text-text-muted font-mono">admin@portfolio: ~</span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 font-mono">
            <div className="space-y-1">
              <p className="text-git-green text-xs">$ sudo admin login</p>
              <p className="text-text-faint text-xs"># enter your credentials</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-text-muted mb-1">username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full bg-terminal-bg border border-terminal-border rounded-lg px-3 py-2 text-xs text-text-primary placeholder-text-faint focus:outline-none focus:border-git-blue/50 focus:ring-1 focus:ring-git-blue/20 transition-colors"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-terminal-bg border border-terminal-border rounded-lg px-3 py-2 text-xs text-text-primary placeholder-text-faint focus:outline-none focus:border-git-blue/50 focus:ring-1 focus:ring-git-blue/20 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-git-red text-xs">[✗] {error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg border border-git-green/40 bg-git-green/10 text-git-green text-xs font-mono hover:bg-git-green/20 hover:border-git-green/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "$ git authenticate --admin"}
            </button>
          </form>
        </div>

        <p className="text-center text-text-faint text-xs font-mono mt-4">
          Portfolio Admin Panel
        </p>
      </div>
    </div>
  );
}
