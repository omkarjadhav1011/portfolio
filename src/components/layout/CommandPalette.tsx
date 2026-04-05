"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { useTerminal } from "@/hooks/useTerminal";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { history, input, setInput, submit, navigateHistory } = useTerminal();
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Ctrl+K to open
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Auto-scroll to bottom when new output
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submit(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      navigateHistory("up");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      navigateHistory("down");
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl"
              >
                <div className="rounded-xl overflow-hidden shadow-terminal border border-terminal-border bg-terminal-window font-mono">
                  {/* Title bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-terminal-surface border-b border-terminal-border">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                      <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                      <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <span className="text-xs text-text-muted">portfolio terminal</span>
                    <button
                      onClick={() => setOpen(false)}
                      className="text-text-faint hover:text-text-muted text-xs px-1"
                    >
                      ESC
                    </button>
                  </div>

                  {/* Output history */}
                  <div className="max-h-72 overflow-y-auto p-4 space-y-3 text-sm">
                    {history.length === 0 && (
                      <div className="text-text-faint text-xs">
                        <p>Type a command. Try: <span className="text-git-green">help</span></p>
                      </div>
                    )}
                    {history.map((h, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex gap-2">
                          <span className="text-git-green">$</span>
                          <span className="text-text-primary">{h.command}</span>
                        </div>
                        {h.result.output.map((line, li) => (
                          <div
                            key={li}
                            className={cn(
                              "pl-4 text-xs",
                              h.result.type === "error"
                                ? "text-git-red"
                                : line.startsWith("*")
                                ? "text-git-green"
                                : "text-text-muted"
                            )}
                          >
                            {line || "\u00A0"}
                          </div>
                        ))}
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>

                  {/* Input */}
                  <div className="flex items-center gap-2 px-4 py-3 border-t border-terminal-border bg-terminal-bg">
                    <span className="text-git-green text-sm shrink-0">$</span>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="git checkout projects"
                      className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-faint outline-none font-mono"
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <span className="w-2 h-4 bg-git-green animate-cursor-blink" />
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
