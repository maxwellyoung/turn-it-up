import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { pantasia } from "@/lib/fonts";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://wherehaveyoubeen.blog"),
  title: "TURN IT UP | Maxwell Young & Thom Haha",
  description: "A new single by Maxwell Young & Thom Haha",
  keywords: [
    "Maxwell Young",
    "Thom Haha",
    "electronic music",
    "music",
    "producer",
    "artist",
    "new zealand music",
    "new zealand artist",
    "new zealand producer",
    "collaboration",
    "electronic",
    "dance music",
    "new release",
    "turn it up",
    "maxwell young",
    "thom haha",
    "maxwell young and thom haha",
    "maxwell young and thom haha collaboration",
    "maxwell young and thom haha new single",
    "maxwell young and thom haha new release",
    "maxwell young and thom haha new music",
    "maxwell young and thom haha new song",
    "maxwell young and thom haha new album",
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
      "A new collaboration between Maxwell Young and Thom Haha, out now.",
    creator: "@internetmaxwell",
    images: ["/photos/9.jpeg"],
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
  manifest: "/manifest.json",
  other: {
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
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
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-Z7J3101TTX`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z7J3101TTX');
          `}
        </Script>
        {/* Preload critical assets */}
        <link
          rel="preload"
          href="/fonts/Pantasia.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
