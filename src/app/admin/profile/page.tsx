import { prisma } from "@/lib/prisma";
import { ProfileClient } from "./ProfileClient";
import { profile as staticProfile } from "@/data/profile";

export default async function ProfilePage() {
  const raw = (await prisma.profile.findUnique({ where: { id: "main" } })) as
    | (Awaited<ReturnType<typeof prisma.profile.findUnique>> & {
        currentRoleEnabled?: boolean | null;
        currentRoleTitle?: string | null;
        currentRoleCompany?: string | null;
        currentRoleMonogram?: string | null;
        currentRoleLogoUrl?: string | null;
        currentRoleUrl?: string | null;
        currentRoleLocation?: string | null;
        currentRoleStarted?: string | null;
        currentRoleTenure?: string | null;
        currentRoleAccent?: string | null;
      })
    | null;

  const profileData = raw
    ? {
        ...raw,
        socials: JSON.parse(raw.socials),
        funFacts: JSON.parse(raw.funFacts),
        stash: raw.stash ? JSON.parse(raw.stash) : [],
        currentRole: {
          enabled: !!raw.currentRoleEnabled,
          title: raw.currentRoleTitle ?? "",
          company: raw.currentRoleCompany ?? "",
          monogram: raw.currentRoleMonogram ?? "",
          logoUrl: raw.currentRoleLogoUrl ?? "",
          url: raw.currentRoleUrl ?? "",
          location: raw.currentRoleLocation ?? "",
          startedAt: raw.currentRoleStarted ?? "",
          tenure: raw.currentRoleTenure ?? "",
          accent: raw.currentRoleAccent ?? "#00ff88",
        },
      }
    : {
        ...staticProfile,
        stash: staticProfile.stash ?? [],
        currentRole: staticProfile.currentRole ?? {
          enabled: false,
          title: "",
          company: "",
          monogram: "",
          logoUrl: "",
          url: "",
          location: "",
          startedAt: "",
          tenure: "",
          accent: "#00ff88",
        },
      };

  return <ProfileClient initialProfile={profileData} />;
}
