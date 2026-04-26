import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { AdminStatusBar } from "@/components/admin/AdminStatusBar";
import { EditorChrome } from "@/components/admin/EditorChrome";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Admin — Portfolio" };
export const dynamic = "force-dynamic";

async function getProfileName() {
  try {
    const p = await prisma.profile.findUnique({
      where: { id: "main" },
      select: { name: true },
    });
    return p?.name ?? "Admin";
  } catch {
    return "Admin";
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profileName = await getProfileName();

  return (
    <div className="flex flex-col h-screen bg-terminal-bg text-text-primary">
      <AdminTopBar profileName={profileName} />
      <div className="flex-1 flex overflow-hidden">
        <AdminSidebar />
        <EditorChrome>
          <main className="p-4 pt-16 md:p-6">{children}</main>
        </EditorChrome>
      </div>
      <AdminStatusBar />
    </div>
  );
}
