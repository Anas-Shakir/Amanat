import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Amanat — Verifiable Local Aid Infrastructure",
  description:
    "A local aid infrastructure network connecting humanitarian funding to verified household entitlements and local merchants in Dadu, Sindh.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} dark`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-[#070b12] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col font-sans">
        {/* Global Top Notification / Mode Banner */}
        <div className="bg-gradient-to-r from-emerald-950/70 via-cyan-950/60 to-slate-900 border-b border-emerald-500/20 px-4 py-1.5 text-xs text-center flex items-center justify-center gap-2 text-emerald-300">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium tracking-wide">
            Amanat Local Aid Network • Active Node: Dadu, Sindh • Verifiable on Base Sepolia
          </span>
        </div>

        {/* Global Navigation Header */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b12]/85 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Amanat
                </span>
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">
                  Local Aid Infra
                </span>
              </div>
            </Link>

            {/* Role Navigation Pills */}
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-full border border-slate-800 text-xs font-medium">
              <Link
                href="/donor"
                className="px-3.5 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Donor Portal
              </Link>
              <Link
                href="/merchant"
                className="px-3.5 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Merchant PWA
              </Link>
              <Link
                href="/organization"
                className="px-3.5 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Issuer & NGO
              </Link>
              <Link
                href="/admin"
                className="px-3.5 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Admin & Audit
              </Link>
              <Link
                href="/voucher"
                className="px-3.5 py-1.5 rounded-full text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/60 transition-colors"
              >
                Demo Voucher SMS
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/merchant"
                className="md:hidden px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors"
              >
                Shop PWA
              </Link>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span>Base Sepolia</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Body Content */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Global Footer */}
        <footer className="border-t border-slate-800/80 bg-[#05080e] py-8 px-4 sm:px-6 text-slate-400 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200">Amanat</span> — Verifiable Local Aid Infrastructure for Dadu & Disaster-Prone Communities.
            </div>
            <div className="flex items-center gap-6 text-slate-500">
              <Link href="/donor" className="hover:text-slate-300">Donors</Link>
              <Link href="/merchant" className="hover:text-slate-300">Merchants</Link>
              <Link href="/organization" className="hover:text-slate-300">Issuers</Link>
              <Link href="/admin" className="hover:text-slate-300">Audit Trail</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
