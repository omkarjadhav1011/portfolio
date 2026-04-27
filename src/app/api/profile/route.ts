import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { profileSchema } from "@/lib/admin-validations";

type ProfileWithRole = {
  socials: string;
  funFacts: string;
  stash: string | null;
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
};

function shape(profile: ProfileWithRole & Record<string, unknown>) {
  return {
    ...profile,
    socials: JSON.parse(profile.socials),
    funFacts: JSON.parse(profile.funFacts),
    stash: profile.stash ? JSON.parse(profile.stash) : [],
    currentRole: {
      enabled: !!profile.currentRoleEnabled,
      title: profile.currentRoleTitle ?? "",
      company: profile.currentRoleCompany ?? "",
      monogram: profile.currentRoleMonogram ?? "",
      logoUrl: profile.currentRoleLogoUrl ?? "",
      url: profile.currentRoleUrl ?? "",
      location: profile.currentRoleLocation ?? "",
      startedAt: profile.currentRoleStarted ?? "",
      tenure: profile.currentRoleTenure ?? "",
      accent: profile.currentRoleAccent ?? "#00ff88",
    },
  };
}

export async function GET() {
  try {
    const profile = await prisma.profile.findUnique({ where: { id: "main" } });
    if (!profile) return NextResponse.json(null);
    return NextResponse.json(shape(profile as unknown as ProfileWithRole));
  } catch {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = profileSchema.parse(body);

    const role = data.currentRole;
    const roleColumns = {
      currentRoleEnabled: !!role?.enabled,
      currentRoleTitle: role?.title || null,
      currentRoleCompany: role?.company || null,
      currentRoleMonogram: role?.monogram || null,
      currentRoleLogoUrl: role?.logoUrl || null,
      currentRoleUrl: role?.url || null,
      currentRoleLocation: role?.location || null,
      currentRoleStarted: role?.startedAt || null,
      currentRoleTenure: role?.tenure || null,
      currentRoleAccent: role?.accent || null,
    };

    // Strip currentRole from validated data — it's flattened into roleColumns
    const { currentRole: _strip, ...flat } = data;
    void _strip;

    const payload = {
      ...flat,
      socials: JSON.stringify(flat.socials),
      funFacts: JSON.stringify(flat.funFacts),
      stash: flat.stash ? JSON.stringify(flat.stash) : null,
      ...roleColumns,
    };

    const profile = await prisma.profile.upsert({
      where: { id: "main" },
      // Cast through `unknown` because Prisma client types are regenerated post-migration.
      create: { id: "main", ...payload } as unknown as Parameters<typeof prisma.profile.upsert>[0]["create"],
      update: payload as unknown as Parameters<typeof prisma.profile.upsert>[0]["update"],
    });

    revalidatePath("/");
    return NextResponse.json(shape(profile as unknown as ProfileWithRole));
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
