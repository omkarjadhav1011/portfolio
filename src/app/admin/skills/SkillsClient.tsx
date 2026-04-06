"use client";

import { useState } from "react";
import { AdminModal } from "@/components/admin/AdminModal";
import { FormInput, FormSelect } from "@/components/admin/FormField";
import { useToast } from "@/components/admin/ToastProvider";
import { useRouter } from "next/navigation";

interface Skill {
  id: string;
  name: string;
  level: number;
  tag?: string | null;
  icon?: string | null;
  branchId: string;
}

interface SkillBranch {
  id: string;
  branchName: string;
  color: string;
  offset: number;
  skills: Skill[];
}

interface SkillDiff {
  id: string;
  name: string;
  type: string;
  note?: string | null;
}

const DIFF_TYPE_OPTIONS = [
  { value: "added", label: "added" },
  { value: "modified", label: "modified" },
  { value: "deprecated", label: "deprecated" },
];

const LEVEL_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({
  value: String(n),
  label: `${n} — ${["Learning", "Familiar", "Proficient", "Advanced", "Expert"][n - 1]}`,
}));

export function SkillsClient({
  initialBranches,
  initialDiffs,
}: {
  initialBranches: SkillBranch[];
  initialDiffs: SkillDiff[];
}) {
  const [branches, setBranches] = useState(initialBranches);
  const [diffs, setDiffs] = useState(initialDiffs);
  const { toast } = useToast();
  const router = useRouter();

  // Skill modal state
  const [skillModal, setSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillBranchId, setSkillBranchId] = useState("");
  const [skillForm, setSkillForm] = useState({ name: "", level: "3", tag: "", icon: "" });

  // Diff modal state
  const [diffModal, setDiffModal] = useState(false);
  const [editingDiff, setEditingDiff] = useState<SkillDiff | null>(null);
  const [diffForm, setDiffForm] = useState({ name: "", type: "added", note: "" });

  const [loading, setLoading] = useState(false);

  function openAddSkill(branchId: string) {
    setEditingSkill(null);
    setSkillBranchId(branchId);
    setSkillForm({ name: "", level: "3", tag: "", icon: "" });
    setSkillModal(true);
  }

  function openEditSkill(skill: Skill) {
    setEditingSkill(skill);
    setSkillBranchId(skill.branchId);
    setSkillForm({ name: skill.name, level: String(skill.level), tag: skill.tag ?? "", icon: skill.icon ?? "" });
    setSkillModal(true);
  }

  async function handleSkillDelete(branchId: string, skillId: string) {
    if (!confirm("Delete this skill?")) return;
    const res = await fetch(`/api/skills/branches/${branchId}/skills/${skillId}`, { method: "DELETE" });
    if (res.ok) {
      setBranches((prev) =>
        prev.map((b) => b.id === branchId ? { ...b, skills: b.skills.filter((s) => s.id !== skillId) } : b)
      );
      toast("Skill deleted", "success");
      router.refresh();
    } else {
      toast("Failed to delete skill", "error");
    }
  }

  async function handleSkillSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: skillForm.name, level: Number(skillForm.level), tag: skillForm.tag || undefined, icon: skillForm.icon || undefined };
      let res: Response;
      if (editingSkill) {
        res = await fetch(`/api/skills/branches/${skillBranchId}/skills/${editingSkill.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/skills/branches/${skillBranchId}/skills`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
      }
      if (res.ok) {
        const saved: Skill = await res.json();
        setBranches((prev) =>
          prev.map((b) => {
            if (b.id !== skillBranchId) return b;
            if (editingSkill) {
              return { ...b, skills: b.skills.map((s) => (s.id === saved.id ? saved : s)) };
            }
            return { ...b, skills: [...b.skills, saved] };
          })
        );
        toast(editingSkill ? "Skill updated" : "Skill added", "success");
        setSkillModal(false);
        router.refresh();
      } else {
        const err = await res.json();
        toast(err.error ?? "Failed to save", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  // Diff handlers
  function openAddDiff() {
    setEditingDiff(null);
    setDiffForm({ name: "", type: "added", note: "" });
    setDiffModal(true);
  }

  function openEditDiff(d: SkillDiff) {
    setEditingDiff(d);
    setDiffForm({ name: d.name, type: d.type, note: d.note ?? "" });
    setDiffModal(true);
  }

  async function handleDiffDelete(id: string) {
    if (!confirm("Delete this diff entry?")) return;
    const res = await fetch(`/api/skills/diff/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDiffs((prev) => prev.filter((d) => d.id !== id));
      toast("Diff deleted", "success");
      router.refresh();
    } else {
      toast("Failed to delete", "error");
    }
  }

  async function handleDiffSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: diffForm.name, type: diffForm.type, note: diffForm.note || undefined };
      const url = editingDiff ? `/api/skills/diff/${editingDiff.id}` : "/api/skills/diff";
      const method = editingDiff ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        const saved: SkillDiff = await res.json();
        if (editingDiff) {
          setDiffs((prev) => prev.map((d) => (d.id === saved.id ? saved : d)));
          toast("Diff updated", "success");
        } else {
          setDiffs((prev) => [...prev, saved]);
          toast("Diff added", "success");
        }
        setDiffModal(false);
        router.refresh();
      } else {
        const err = await res.json();
        toast(err.error ?? "Failed to save", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  const DIFF_COLORS: Record<string, string> = { added: "text-git-green", modified: "text-git-yellow", deprecated: "text-git-red" };

  return (
    <div className="space-y-8 font-mono">
      <div>
        <div className="text-text-faint text-xs mb-1">$ git branch -a --verbose</div>
        <h1 className="text-xl font-bold text-text-primary">Skills</h1>
      </div>

      {/* Branches */}
      <div className="space-y-4">
        {branches.map((branch) => (
          <div key={branch.id} className="rounded-xl border border-terminal-border bg-terminal-surface overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-terminal-bg border-b border-terminal-border">
              <span className="font-mono text-sm font-semibold" style={{ color: branch.color }}>
                ⑂ {branch.branchName}
              </span>
              <button
                onClick={() => openAddSkill(branch.id)}
                className="text-xs text-git-green hover:underline"
              >
                + add skill
              </button>
            </div>
            <div className="p-3 flex flex-wrap gap-2">
              {branch.skills.length === 0 && (
                <span className="text-text-faint text-xs">No skills — add one above</span>
              )}
              {branch.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs"
                  style={{ borderColor: `${branch.color}40`, backgroundColor: `${branch.color}10`, color: branch.color }}
                >
                  {skill.icon && <span>{skill.icon}</span>}
                  <span>{skill.name}</span>
                  <span className="text-[10px] opacity-60">({skill.level}/5)</span>
                  <button onClick={() => openEditSkill(skill)} className="ml-1 opacity-60 hover:opacity-100">✎</button>
                  <button onClick={() => handleSkillDelete(branch.id, skill.id)} className="opacity-60 hover:text-git-red hover:opacity-100">×</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Skill Diff */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-text-faint text-xs mb-1">$ git diff skills/archive skills/current</div>
            <h2 className="text-base font-bold text-text-primary">Stack Evolution</h2>
          </div>
          <button
            onClick={openAddDiff}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-git-green/40 bg-git-green/10 text-git-green text-xs hover:bg-git-green/20 transition-all"
          >
            + add diff
          </button>
        </div>

        <div className="rounded-xl border border-terminal-border bg-terminal-surface overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-terminal-border bg-terminal-bg">
                <th className="text-left px-4 py-3 text-text-muted font-normal">type</th>
                <th className="text-left px-4 py-3 text-text-muted font-normal">name</th>
                <th className="text-left px-4 py-3 text-text-muted font-normal">note</th>
                <th className="text-right px-4 py-3 text-text-muted font-normal">actions</th>
              </tr>
            </thead>
            <tbody>
              {diffs.length === 0 && (
                <tr><td colSpan={4} className="text-center py-8 text-text-faint">No diff entries</td></tr>
              )}
              {diffs.map((d) => (
                <tr key={d.id} className="border-b border-terminal-border/50 hover:bg-terminal-bg/40">
                  <td className={`px-4 py-2.5 font-bold ${DIFF_COLORS[d.type]}`}>
                    {d.type === "added" ? "+" : d.type === "deprecated" ? "-" : "~"} {d.type}
                  </td>
                  <td className={`px-4 py-2.5 ${DIFF_COLORS[d.type]}`}>{d.name}</td>
                  <td className="px-4 py-2.5 text-text-faint">{d.note ?? "—"}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button onClick={() => openEditDiff(d)} className="text-git-blue hover:underline mr-3">edit</button>
                    <button onClick={() => handleDiffDelete(d.id)} className="text-git-red hover:underline">delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Skill Modal */}
      <AdminModal open={skillModal} onClose={() => setSkillModal(false)} title={editingSkill ? `edit skill — ${editingSkill.name}` : "add skill"}>
        <form onSubmit={handleSkillSubmit} className="space-y-4">
          <FormInput label="skill name" value={skillForm.name} onChange={(e) => setSkillForm((p) => ({ ...p, name: e.target.value }))} required />
          <FormSelect label="proficiency level" value={skillForm.level} onChange={(e) => setSkillForm((p) => ({ ...p, level: e.target.value }))} options={LEVEL_OPTIONS} />
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="tag (optional)" value={skillForm.tag} onChange={(e) => setSkillForm((p) => ({ ...p, tag: e.target.value }))} placeholder="v14" />
            <FormInput label="icon (optional)" value={skillForm.icon} onChange={(e) => setSkillForm((p) => ({ ...p, icon: e.target.value }))} placeholder="⚛ or emoji" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg border border-git-green/40 bg-git-green/10 text-git-green text-xs hover:bg-git-green/20 transition-all disabled:opacity-50">
              {loading ? "Saving..." : "$ git add skill"}
            </button>
            <button type="button" onClick={() => setSkillModal(false)} className="px-4 py-2 rounded-lg border border-terminal-border text-text-muted text-xs hover:text-text-secondary transition-colors">cancel</button>
          </div>
        </form>
      </AdminModal>

      {/* Diff Modal */}
      <AdminModal open={diffModal} onClose={() => setDiffModal(false)} title={editingDiff ? "edit diff entry" : "add diff entry"}>
        <form onSubmit={handleDiffSubmit} className="space-y-4">
          <FormInput label="name" value={diffForm.name} onChange={(e) => setDiffForm((p) => ({ ...p, name: e.target.value }))} required />
          <FormSelect label="type" value={diffForm.type} onChange={(e) => setDiffForm((p) => ({ ...p, type: e.target.value }))} options={DIFF_TYPE_OPTIONS} />
          <FormInput label="note (optional)" value={diffForm.note} onChange={(e) => setDiffForm((p) => ({ ...p, note: e.target.value }))} placeholder="learning containerization" />
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg border border-git-green/40 bg-git-green/10 text-git-green text-xs hover:bg-git-green/20 transition-all disabled:opacity-50">
              {loading ? "Saving..." : "$ git diff --add"}
            </button>
            <button type="button" onClick={() => setDiffModal(false)} className="px-4 py-2 rounded-lg border border-terminal-border text-text-muted text-xs hover:text-text-secondary transition-colors">cancel</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
