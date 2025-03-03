import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { pantasia } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "TURN IT UP | Maxwell Young & Thom Haha",
  description: "A physics-inspired music release",
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
