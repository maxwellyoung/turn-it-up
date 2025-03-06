import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { pantasia } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://wherehaveyoubeen.blog"),
  title: "TURN IT UP | Maxwell Young & Thom Haha",
  description:
    "A new collaboration between Maxwell Young and Thom Haha, releasing March 14, 2025.",
  keywords: [
    "Maxwell Young",
    "Thom Haha",
    "electronic music",
    "music",
    "producer",
    "artist",
    "collaboration",
    "electronic",
    "dance music",
    "new release",
  ],
  authors: [
    { name: "Maxwell Young", url: "https://instagram.com/maxwell_young" },
    { name: "Thom Haha", url: "https://instagram.com/thom_haha" },
  ],
  openGraph: {
    title: "TURN IT UP | Maxwell Young & Thom Haha",
    description:
      "A new collaboration between Maxwell Young and Thom Haha, releasing March 14, 2025.",
    type: "website",
    siteName: "TURN IT UP",
    locale: "en_US",
    images: [
      {
        url: "/photos/9.jpeg",
        width: 1200,
        height: 630,
        alt: "TURN IT UP - Maxwell Young & Thom Haha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TURN IT UP | Maxwell Young & Thom Haha",
    description:
      "A new collaboration between Maxwell Young and Thom Haha, releasing March 14, 2025.",
    creator: "@maxwell_young",
    images: ["/images/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
  alternates: {
    canonical: "https://wherehaveyoubeen.blog",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#000000",
    "theme-color": "#000000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pantasia.variable}`}>
      <head>
        {/* Preload critical assets */}
        <link
          rel="preload"
          href="/fonts/Pantasia.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        {/* Content Security Policy */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self' https:; connect-src 'self' https:; font-src 'self' data:;"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
