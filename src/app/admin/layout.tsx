import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin — Portfolio" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-terminal-bg text-text-primary">
      <AdminSidebar />
      <main className="flex-1 p-4 pt-16 md:p-6 overflow-auto">{children}</main>
    </div>
  );
}
