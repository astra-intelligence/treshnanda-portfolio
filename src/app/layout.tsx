import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/cn";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Treshnanda — AI systems & automation engineer",
  description:
    "AI systems and automation engineer in Bali. Agents, automations, and web systems that take repetitive work off your plate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="image"
          href="/hero.webp"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body className={cn(inter.variable, "font-sans antialiased")}>{children}</body>
    </html>
  );
}
