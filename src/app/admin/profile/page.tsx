import { prisma } from "@/lib/prisma";
import { ProfileClient } from "./ProfileClient";
import { profile as staticProfile } from "@/data/profile";

export default async function ProfilePage() {
  const raw = await prisma.profile.findUnique({ where: { id: "main" } });

  const profileData = raw
    ? {
        ...raw,
        socials: JSON.parse(raw.socials),
        funFacts: JSON.parse(raw.funFacts),
        stash: raw.stash ? JSON.parse(raw.stash) : [],
      }
    : {
        ...staticProfile,
        stash: staticProfile.stash ?? [],
      };

  return <ProfileClient initialProfile={profileData} />;
}
