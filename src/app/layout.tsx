import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { pantasia } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "TURN IT UP | Maxwell Young & Thom Haha",
  description:
    "A new collaboration between Maxwell Young and Thom Haha. Coming March 14, 2025.",
  keywords: [
    "Maxwell Young",
    "Thom Haha",
    "electronic music",
    "music",
    "producer",
    "artist",
    "collaboration",
  ],
  openGraph: {
    title: "TURN IT UP | Maxwell Young & Thom Haha",
    description: "A new collaboration between Maxwell Young and Thom Haha.",
    type: "website",
    siteName: "TURN IT UP",
  },
  twitter: {
    card: "summary_large_image",
    title: "TURN IT UP | Maxwell Young & Thom Haha",
    description: "A new collaboration between Maxwell Young and Thom Haha.",
    creator: "@maxwell_young",
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#581C87",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pantasia.variable}`}>
      <body>{children}</body>
    </html>
  );
}
