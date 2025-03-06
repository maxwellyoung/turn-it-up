"use client";

import { useEffect, useState } from "react";
import TeaserPage from "../components/Teaser";
import Release from "../components/Release";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isReleased, setIsReleased] = useState(false);

  useEffect(() => {
    const checkReleaseStatus = () => {
      const releaseDate = new Date("2025-03-14T00:00:00");
      const now = new Date();
      setIsReleased(now.getTime() >= releaseDate.getTime());
      setIsLoading(false);
    };

    // Add toggleRelease to window object safely
    const toggleFn = () => {
      setIsReleased((prev) => {
        const newState = !prev;
        console.log("Switched to", newState ? "release" : "teaser", "version");
        return newState;
      });
    };

    // Type assertion for adding to window
    (window as any).toggleRelease = toggleFn;

    checkReleaseStatus();
    // Check every minute for release status
    const interval = setInterval(checkReleaseStatus, 60000);

    return () => {
      clearInterval(interval);
      delete (window as any).toggleRelease;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return isReleased ? <Release /> : <TeaserPage />;
}
