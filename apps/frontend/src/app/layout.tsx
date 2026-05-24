import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { NavWrapper } from "@/components/nav/nav-wrapper";
import { FooterWrapper } from "@/components/sections/footer-wrapper";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Emery Design Studio — Kirkland, WA",
  description:
    "Considered residential interiors from a small, slow studio on Lake Washington.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:z-[9999] focus:px-5 focus:py-2.5 focus:bg-[#1b3a5b] focus:text-white focus:text-[10px] focus:font-mono focus:tracking-widest focus:uppercase focus:rounded-full focus:outline-none"
        >
          Skip to main content
        </a>
        <NavWrapper />
        {children}
        <FooterWrapper />
      </body>
    </html>
  );
}
