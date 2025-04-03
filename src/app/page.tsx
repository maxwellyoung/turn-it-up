"use client";

import { useEffect } from "react";
import Release from "@/components/Release";
import Teaser from "@/components/Teaser";
import { pageview } from "@/lib/gtag";

export default function Home() {
  const siteMode = process.env.NEXT_PUBLIC_SITE_MODE || "release";

  useEffect(() => {
    // Track page view
    pageview(window.location.pathname);
  }, []);

  return siteMode === "teaser" ? <Teaser /> : <Release />;
}
