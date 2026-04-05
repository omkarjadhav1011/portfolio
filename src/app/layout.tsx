import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/react";
import "@/styles/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { profile } from "@/data/profile";

const CommandPalette = dynamic(
  () => import("@/components/layout/CommandPalette").then((m) => m.CommandPalette),
  { ssr: false }
);

const StatusBar = dynamic(
  () => import("@/components/layout/StatusBar").then((m) => m.StatusBar),
  { ssr: false }
);

const BASE_URL = "https://omkarjadhav.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${profile.name} — ${profile.headline}`,
    template: `%s | ${profile.name}`,
  },
  description: `Portfolio of ${profile.name}. ${profile.headline}. ${profile.currentStatus}. Based in ${profile.location}.`,
  keywords: [
    "Omkar Jadhav",
    "portfolio",
    "developer",
    "full-stack",
    "PHP",
    "Python",
    "machine learning",
    "b.tech",
    "cse",
    "data science",
    "KIT Kolhapur",
  ],
  authors: [{ name: profile.name, url: profile.socials[0]?.url }],
  creator: profile.name,
  openGraph: {
    title: `${profile.name} — Developer Portfolio`,
    description: `${profile.headline}. ${profile.currentStatus}.`,
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: `${profile.name}'s Portfolio`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${profile.name} — Developer Portfolio` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Developer Portfolio`,
    description: `${profile.headline}. ${profile.currentStatus}.`,
    creator: `@${profile.handle}`,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="relative">
        <Navbar />
        <CommandPalette />
        <main className="pb-7">{children}</main>
        <Footer />
        <StatusBar />
        <Analytics />
      </body>
    </html>
  );
}
