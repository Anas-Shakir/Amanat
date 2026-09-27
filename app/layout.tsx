import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/components/auth/auth-context";
import { DemoRoleSwitcher } from "@/components/auth/demo-role-switcher";
import { PWAProvider } from "@/components/pwa/pwa-provider";
import { OfflineBanner } from "@/components/pwa/offline-banner";
import { InstallBanner } from "@/components/pwa/install-banner";

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
  themeColor: "#772f1a",
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
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen bg-[#fbf9f6] text-[#2b1712] antialiased selection:bg-[#fae4cb] selection:text-[#772f1a] flex flex-col font-sans">
        <PWAProvider>
          <AuthProvider>
            <OfflineBanner />
            {/* Global Top Notification / Mode Banner */}
            <div className="bg-[#772f1a] text-[#fae4cb] px-4 py-2 text-xs text-center flex items-center justify-center gap-2 border-b border-[#521f11]">
              <span className="flex h-2 w-2 rounded-full bg-[#f58549] animate-pulse" />
              <span className="font-semibold tracking-wide">
                Amanat Local Aid Network • Active Node: Dadu, Sindh • Verifiable on Base Sepolia (#84532)
              </span>
            </div>

            {/* Global Navigation Header */}
            <header className="sticky top-0 z-40 w-full border-b border-[#eadecd] bg-[#ffffff]/95 backdrop-blur-md shadow-xs">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-[#772f1a] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#772f1a]/20 group-hover:bg-[#521f11] transition-colors">
                    A
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold tracking-tight text-[#772f1a] group-hover:text-[#521f11] transition-colors">
                      Amanat
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[#585123] font-bold">
                      Local Aid Infra
                    </span>
                  </div>
                </Link>

                {/* Role Navigation Pills */}
                <nav className="hidden lg:flex items-center gap-1.5 bg-[#f5f0e8] p-1.5 rounded-full border border-[#eadecd] text-xs font-semibold">
                  <Link
                    href="/map"
                    className="px-3.5 py-1.5 rounded-full text-[#6e5c54] hover:text-[#772f1a] hover:bg-[#ffffff] transition-all flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#585123]" />
                    Aid Map
                  </Link>
                  <Link
                    href="/donor"
                    className="px-3.5 py-1.5 rounded-full text-[#6e5c54] hover:text-[#772f1a] hover:bg-[#ffffff] transition-all"
                  >
                    Donor Portal
                  </Link>
                  <Link
                    href="/merchant"
                    className="px-3.5 py-1.5 rounded-full text-[#6e5c54] hover:text-[#772f1a] hover:bg-[#ffffff] transition-all"
                  >
                    Merchant PWA
                  </Link>
                  <Link
                    href="/organization"
                    className="px-3.5 py-1.5 rounded-full text-[#6e5c54] hover:text-[#772f1a] hover:bg-[#ffffff] transition-all"
                  >
                    Issuer & NGO
                  </Link>
                  <Link
                    href="/admin"
                    className="px-3.5 py-1.5 rounded-full text-[#6e5c54] hover:text-[#772f1a] hover:bg-[#ffffff] transition-all"
                  >
                    Admin & Relayer
                  </Link>
                  <Link
                    href="/voucher"
                    className="px-3.5 py-1.5 rounded-full text-white bg-[#f58549] hover:bg-[#e07133] transition-all shadow-xs"
                  >
                    SMS Voucher
                  </Link>
                </nav>

                {/* Right Action: Demo Role Switcher */}
                <div className="flex items-center gap-3">
                  <DemoRoleSwitcher />
                </div>
              </div>
            </header>

            {/* Main Body Content */}
            <main className="flex-1 flex flex-col">{children}</main>

            {/* Mobile PWA Install Banner */}
            <InstallBanner />

            {/* Global Footer */}
            <footer className="border-t border-[#eadecd] bg-[#f5f0e8] py-8 px-4 sm:px-6 text-[#6e5c54] text-xs">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#772f1a]">Amanat</span> — Verifiable Local Aid Infrastructure for Dadu & Disaster-Prone Communities.
                </div>
                <div className="flex items-center gap-6 text-[#6e5c54] font-medium">
                  <Link href="/map" className="hover:text-[#772f1a]">Aid Map</Link>
                  <Link href="/donor" className="hover:text-[#772f1a]">Donors</Link>
                  <Link href="/merchant" className="hover:text-[#772f1a]">Merchants</Link>
                  <Link href="/organization" className="hover:text-[#772f1a]">Issuers</Link>
                  <Link href="/admin" className="hover:text-[#772f1a]">Audit Trail</Link>
                  <Link href="/login" className="hover:text-[#772f1a]">Login</Link>
                </div>
              </div>
            </footer>
          </AuthProvider>
        </PWAProvider>
      </body>
    </html>
  );
}
