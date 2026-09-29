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
  openGraph: {
    title: "Treshnanda — AI systems & automation engineer",
    description:
      "AI systems and automation engineer in Bali. Agents, automations, and web systems that take repetitive work off your plate.",
    url: "https://treshnanda.tech",
    siteName: "Treshnanda",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Treshnanda — AI Systems & Automation Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Treshnanda — AI systems & automation engineer",
    description:
      "AI systems and automation engineer in Bali. Agents, automations, and web systems that take repetitive work off your plate.",
    images: ["/og-image.png"],
  },
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