import { ToastProvider } from "@/components/admin/ToastProvider";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin — Portfolio" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-terminal-bg text-text-primary">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </ToastProvider>
  );
}
