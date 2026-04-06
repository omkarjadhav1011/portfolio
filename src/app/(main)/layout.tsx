import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const CommandPalette = dynamic(
  () => import("@/components/layout/CommandPalette").then((m) => m.CommandPalette),
  { ssr: false }
);

const StatusBar = dynamic(
  () => import("@/components/layout/StatusBar").then((m) => m.StatusBar),
  { ssr: false }
);

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CommandPalette />
      <main className="pb-7">{children}</main>
      <Footer />
      <StatusBar />
    </>
  );
}
