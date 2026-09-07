import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { Analytics } from "@/components/analytics/Analytics";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ceaseless Intelligence — Growth Infrastructure",
    template: "%s — Ceaseless Intelligence",
  },
  description:
    "Ceaseless Intelligence builds customer acquisition, AI automation, and revenue systems for businesses with something worth scaling.",
  keywords: [
    "growth infrastructure",
    "customer acquisition systems",
    "AI automation for business",
    "revenue infrastructure",
    "B2B growth partner",
    "AI agents",
    "sales automation",
  ],
  openGraph: {
    title: "Ceaseless Intelligence — Growth Infrastructure",
    description:
      "We engineer growth. Customer acquisition, AI automation, and revenue infrastructure for businesses with something worth scaling.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-0 focus:top-0 focus:z-[200] focus:bg-ink focus:px-5 focus:py-3 focus:font-sans focus:text-sm focus:text-ivory"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
        <Analytics />
      </body>
    </html>
  );
}
