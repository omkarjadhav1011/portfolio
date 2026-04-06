"use client";

import { useState } from "react";
import { AdminModal } from "@/components/admin/AdminModal";
import { FormInput, FormTextarea, FormSelect } from "@/components/admin/FormField";
import { TagInput } from "@/components/admin/TagInput";
import { useToast } from "@/components/admin/ToastProvider";
import { useRouter } from "next/navigation";

interface CommitEntry {
  id: string;
  hash: string;
  type: string;
  title: string;
  org: string;
  date: string;
  dateEnd?: string | null;
  description: string[];
  branch: string;
  branchColor: string;
  colorKey?: string | null;
  tags?: string[] | null;
  url?: string | null;
}

const EMPTY: Omit<CommitEntry, "id"> = {
  hash: "", type: "job", title: "", org: "", date: "", dateEnd: "",
  description: [], branch: "", branchColor: "#00ff88", colorKey: "green",
  tags: [], url: "",
};

const TYPE_OPTIONS = [
  { value: "job", label: "job" },
  { value: "education", label: "education" },
  { value: "achievement", label: "achievement" },
  { value: "project", label: "project" },
];

const COLOR_OPTIONS = [
  { value: "green", label: "green" },
  { value: "blue", label: "blue" },
  { value: "yellow", label: "yellow" },
  { value: "orange", label: "orange" },
];

export function ExperienceClient({ initialEntries }: { initialEntries: CommitEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CommitEntry | null>(null);
  const [form, setForm] = useState<Omit<CommitEntry, "id">>(EMPTY);
  const [descText, setDescText] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setDescText("");
    setModalOpen(true);
  }

  function openEdit(e: CommitEntry) {
    setEditing(e);
    setForm({ ...e, dateEnd: e.dateEnd ?? "", url: e.url ?? "", colorKey: e.colorKey ?? "green", tags: e.tags ?? [] });
    setDescText((e.description ?? []).join("\n"));
    setModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast("Entry deleted", "success");
      router.refresh();
    } else {
      toast("Failed to delete", "error");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const description = descText.split("\n").map((l) => l.trim()).filter(Boolean);
    try {
      const url = editing ? `/api/experience/${editing.id}` : "/api/experience";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, description, dateEnd: form.dateEnd || undefined, url: form.url || undefined }),
      });
      if (res.ok) {
        const saved: CommitEntry = await res.json();
        if (editing) {
          setEntries((prev) => prev.map((e) => (e.id === saved.id ? saved : e)));
          toast("Entry updated", "success");
        } else {
          setEntries((prev) => [saved, ...prev]);
          toast("Entry created", "success");
        }
        setModalOpen(false);
        router.refresh();
      } else {
        const err = await res.json();
        toast(err.error ?? "Failed to save", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  function field(key: keyof typeof form, value: string | string[]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const TYPE_ICONS: Record<string, string> = { job: "💼", education: "🎓", achievement: "🏆", project: "📁" };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-text-faint text-xs mb-1">$ git log --all --pretty=format:"%h %s"</div>
          <h1 className="text-xl font-bold text-text-primary">Experience</h1>
          <p className="text-text-muted text-xs mt-0.5"># {entries.length} commit entries</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-git-green/40 bg-git-green/10 text-git-green text-xs hover:bg-git-green/20 transition-all"
        >
          <span>+</span> new entry
        </button>
      </div>

      <div className="rounded-xl border border-terminal-border bg-terminal-surface overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-terminal-border bg-terminal-bg">
              <th className="text-left px-4 py-3 text-text-muted font-normal">hash</th>
              <th className="text-left px-4 py-3 text-text-muted font-normal">type</th>
              <th className="text-left px-4 py-3 text-text-muted font-normal">title</th>
              <th className="text-left px-4 py-3 text-text-muted font-normal">org</th>
              <th className="text-left px-4 py-3 text-text-muted font-normal">date</th>
              <th className="text-right px-4 py-3 text-text-muted font-normal">actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-text-faint">No entries yet</td></tr>
            )}
            {entries.map((e) => (
              <tr key={e.id} className="border-b border-terminal-border/50 hover:bg-terminal-bg/40 transition-colors">
                <td className="px-4 py-3 text-git-orange font-mono">{e.hash.slice(0, 7)}</td>
                <td className="px-4 py-3">{TYPE_ICONS[e.type]} {e.type}</td>
                <td className="px-4 py-3 text-text-primary">{e.title}</td>
                <td className="px-4 py-3 text-text-muted">{e.org}</td>
                <td className="px-4 py-3 text-text-faint">{e.date}{e.dateEnd ? ` — ${e.dateEnd}` : ""}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(e)} className="text-git-blue hover:underline mr-3">edit</button>
                  <button onClick={() => handleDelete(e.id)} className="text-git-red hover:underline">delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `edit — ${editing.hash}` : "new entry"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="hash (7 chars)" value={form.hash} onChange={(e) => field("hash", e.target.value)} required placeholder="a1b2c3d" />
            <FormSelect label="type" value={form.type} onChange={(e) => field("type", e.target.value)} options={TYPE_OPTIONS} />
          </div>
          <FormInput label="title" value={form.title} onChange={(e) => field("title", e.target.value)} required />
          <FormInput label="organization" value={form.org} onChange={(e) => field("org", e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="start date" value={form.date} onChange={(e) => field("date", e.target.value)} required placeholder="Jan 2024" />
            <FormInput label="end date (optional)" value={form.dateEnd ?? ""} onChange={(e) => field("dateEnd", e.target.value)} placeholder="Dec 2024 or leave blank" />
          </div>
          <FormTextarea
            label="description (one bullet per line)"
            value={descText}
            onChange={(e) => setDescText(e.target.value)}
            rows={4}
            placeholder="Built X using Y&#10;Achieved Z"
          />
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="branch name" value={form.branch} onChange={(e) => field("branch", e.target.value)} required placeholder="work/company-name" />
            <FormInput label="branch color (hex)" value={form.branchColor} onChange={(e) => field("branchColor", e.target.value)} placeholder="#00ff88" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormSelect label="color key" value={form.colorKey ?? "green"} onChange={(e) => field("colorKey", e.target.value)} options={COLOR_OPTIONS} />
            <FormInput label="url (optional)" value={form.url ?? ""} onChange={(e) => field("url", e.target.value)} placeholder="https://..." />
          </div>
          <TagInput label="tags" values={form.tags ?? []} onChange={(v) => field("tags", v)} />
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg border border-git-green/40 bg-git-green/10 text-git-green text-xs hover:bg-git-green/20 transition-all disabled:opacity-50">
              {loading ? "Saving..." : editing ? "$ git commit --amend" : "$ git commit -m 'new entry'"}
            </button>
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-terminal-border text-text-muted text-xs hover:text-text-secondary transition-colors">cancel</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
