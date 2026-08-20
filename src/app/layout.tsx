import type { Metadata } from "next";
import { Geist, Geist_Mono, Fredoka } from "next/font/google";
import { AuthNav } from "@/components/AuthNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "We're Building Our Next Identity | Brand Naming Contest",
  description:
    "Our business has outgrown its old name. Help us name and design the identity for what comes next — and win a Dhaka–Cox's Bazar–Dhaka flight ticket.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-50 border-b border-panel-border bg-background/80 backdrop-blur">
          <div className="container-narrow flex items-center justify-between py-4">
            <span className="font-display font-semibold tracking-tight text-lg">Brain Station 23</span>
            <div className="flex items-center gap-4">
              <a href="#submit" className="hidden sm:inline text-sm text-muted hover:text-white transition">
                Contest
              </a>
              <a href="#live-submissions" className="hidden sm:inline text-sm text-muted hover:text-white transition">
                Live Submissions
              </a>
              <AuthNav />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
