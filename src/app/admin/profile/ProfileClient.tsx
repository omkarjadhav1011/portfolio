"use client";

import { useState } from "react";
import { FormInput, FormTextarea, FormCheckbox } from "@/components/admin/FormField";
import { TagInput } from "@/components/admin/TagInput";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { useToast } from "@/components/admin/ToastProvider";
import { useFormValidation } from "@/hooks/useFormValidation";
import { profileSchema } from "@/lib/admin-validations";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

interface Profile {
  name: string;
  handle: string;
  headline: string;
  bio: string;
  currentBranch: string;
  currentStatus: string;
  availableForWork: boolean;
  email: string;
  location: string;
  socials: SocialLink[];
  funFacts: string[];
  stash?: string[];
}

export function ProfileClient({ initialProfile }: { initialProfile: Profile }) {
  const [form, setForm] = useState<Profile>(initialProfile);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { errors, validate, clearErrors } = useFormValidation(profileSchema);

  function field(key: keyof Profile, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateSocial(index: number, key: keyof SocialLink, value: string) {
    const updated = form.socials.map((s, i) => (i === index ? { ...s, [key]: value } : s));
    field("socials", updated);
  }

  function addSocial() {
    field("socials", [...form.socials, { label: "", url: "", icon: "" }]);
  }

  function removeSocial(index: number) {
    field("socials", form.socials.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate(form)) return;
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast("Profile updated", "success");
        router.refresh();
      } else {
        const err = await res.json();
        toast(err.error ?? "Failed to update", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full bg-terminal-bg border border-terminal-border rounded-lg px-3 py-2 font-mono text-xs text-text-primary placeholder-text-faint focus:outline-none focus:border-git-blue/50 focus:ring-1 focus:ring-git-blue/20 transition-colors";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 font-mono">
      <div>
        <div className="text-text-faint text-xs mb-1">$ git config --global user.profile</div>
        <h1 className="text-xl font-bold text-text-primary">Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Basic info */}
        <div className="rounded-xl border border-terminal-border bg-terminal-surface p-5 space-y-4">
          <div className="text-text-faint text-xs border-b border-terminal-border pb-2">## Basic Info</div>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="name" value={form.name} onChange={(e) => field("name", e.target.value)} error={errors.name} required />
            <FormInput label="handle" value={form.handle} onChange={(e) => field("handle", e.target.value)} error={errors.handle} required placeholder="omkarjadhav" />
          </div>
          <FormInput label="headline" value={form.headline} onChange={(e) => field("headline", e.target.value)} error={errors.headline} required />
          <FormTextarea label="bio" value={form.bio} onChange={(e) => field("bio", e.target.value)} error={errors.bio} rows={5} required />
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="email" type="email" value={form.email} onChange={(e) => field("email", e.target.value)} error={errors.email} required />
            <FormInput label="location" value={form.location} onChange={(e) => field("location", e.target.value)} error={errors.location} required />
          </div>
        </div>

        {/* Git status */}
        <div className="rounded-xl border border-terminal-border bg-terminal-surface p-5 space-y-4">
          <div className="text-text-faint text-xs border-b border-terminal-border pb-2">## Git Status</div>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="current branch" value={form.currentBranch} onChange={(e) => field("currentBranch", e.target.value)} error={errors.currentBranch} required placeholder="main" />
            <FormInput label="current status" value={form.currentStatus} onChange={(e) => field("currentStatus", e.target.value)} error={errors.currentStatus} required placeholder="Open to internships" />
          </div>
          <FormCheckbox label="available for work" checked={form.availableForWork} onChange={(v) => field("availableForWork", v)} />
        </div>

        {/* Socials */}
        <div className="rounded-xl border border-terminal-border bg-terminal-surface p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-terminal-border pb-2">
            <div className="text-text-faint text-xs">## Socials</div>
            <button type="button" onClick={addSocial} className="text-xs text-git-green hover:underline">+ add</button>
          </div>
          {form.socials.map((social, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-end">
              <div>
                <label className="block text-[10px] text-text-muted mb-1">label</label>
                <input className={inputClass} value={social.label} onChange={(e) => updateSocial(i, "label", e.target.value)} placeholder="GitHub" />
              </div>
              <div>
                <label className="block text-[10px] text-text-muted mb-1">url</label>
                <input className={inputClass} value={social.url} onChange={(e) => updateSocial(i, "url", e.target.value)} placeholder="https://github.com/..." />
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-[10px] text-text-muted mb-1">icon key</label>
                  <input className={inputClass} value={social.icon} onChange={(e) => updateSocial(i, "icon", e.target.value)} placeholder="github" />
                </div>
                <button type="button" onClick={() => removeSocial(i)} className="py-2 px-2 text-git-red text-xs hover:underline">×</button>
              </div>
            </div>
          ))}
        </div>

        {/* Fun facts & stash */}
        <div className="rounded-xl border border-terminal-border bg-terminal-surface p-5 space-y-4">
          <div className="text-text-faint text-xs border-b border-terminal-border pb-2">## Fun Facts & Stash</div>
          <TagInput label="fun facts (one per tag)" values={form.funFacts} onChange={(v) => field("funFacts", v)} placeholder="I debug at 2am..." />
          <TagInput label="stash (hobbies/interests)" values={form.stash ?? []} onChange={(v) => field("stash", v)} placeholder="☕ Coffee-driven development" />
        </div>

        <LoadingButton
          type="submit"
          loading={loading}
          loadingText="Saving..."
          className="w-full py-2.5"
        >
          $ git commit -m &apos;update: profile&apos;
        </LoadingButton>
      </form>
    </motion.div>
  );
}
