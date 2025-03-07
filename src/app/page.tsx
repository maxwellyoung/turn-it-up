"use client";

import Release from "@/components/Release";
import Teaser from "@/components/Teaser";

export default function Home() {
  const siteMode = process.env.NEXT_PUBLIC_SITE_MODE || "release";

  return siteMode === "teaser" ? <Teaser /> : <Release />;
}
