import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BETTER — Vision & Ecosystem Roadmap",
  description:
    "The canonical future-state artifact for the BETTER ecosystem: roadmap, tokenomics, architecture, and interactive strategy atlas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-terminal text-lg font-bold tracking-wider text-accent"
          aria-label="BETTER home"
        >
          BETTER<span className="text-muted">_</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm font-medium text-secondary sm:flex">
          <a href="#vision" className="transition-colors hover:text-foreground">
            Vision
          </a>
          <a
            href="#roadmap"
            className="transition-colors hover:text-foreground"
          >
            Roadmap
          </a>
          <a
            href="#tokenomics"
            className="transition-colors hover:text-foreground"
          >
            Tokenomics
          </a>
          <a
            href="#architecture"
            className="transition-colors hover:text-foreground"
          >
            Architecture
          </a>
        </div>
        <MobileMenuButton />
      </nav>
    </header>
  );
}

function MobileMenuButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-md p-2 text-secondary hover:text-foreground sm:hidden"
      aria-label="Open navigation menu"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </button>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="font-terminal text-sm text-muted">
            © {new Date().getFullYear()} BETTER. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            This site presents the BETTER ecosystem vision. Maturity labels
            distinguish live features from planned and speculative roadmap
            items.
          </p>
        </div>
      </div>
    </footer>
  );
}
