import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "@/styles/globals.css";
import { profile } from "@/data/profile";
import { Providers } from "@/components/layout/Providers";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://omkarjadhav.vercel.app";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${jetbrainsMono.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent FOUC: sync theme class before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t||t==='system')&&window.matchMedia('(prefers-color-scheme:dark)').matches;if(!d)document.documentElement.classList.remove('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="relative">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
