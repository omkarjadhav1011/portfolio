import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { profileSchema } from "@/lib/admin-validations";

export async function GET() {
  try {
    const profile = await prisma.profile.findUnique({ where: { id: "main" } });
    if (!profile) return NextResponse.json(null);

    return NextResponse.json({
      ...profile,
      socials: JSON.parse(profile.socials),
      funFacts: JSON.parse(profile.funFacts),
      stash: profile.stash ? JSON.parse(profile.stash) : [],
    });
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

    const profile = await prisma.profile.upsert({
      where: { id: "main" },
      create: {
        id: "main",
        ...data,
        socials: JSON.stringify(data.socials),
        funFacts: JSON.stringify(data.funFacts),
        stash: data.stash ? JSON.stringify(data.stash) : null,
      },
      update: {
        ...data,
        socials: JSON.stringify(data.socials),
        funFacts: JSON.stringify(data.funFacts),
        stash: data.stash ? JSON.stringify(data.stash) : null,
      },
    });

    revalidatePath("/");
    return NextResponse.json({
      ...profile,
      socials: JSON.parse(profile.socials),
      funFacts: JSON.parse(profile.funFacts),
      stash: profile.stash ? JSON.parse(profile.stash) : [],
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
