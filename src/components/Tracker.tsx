"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Tracker() {
  const pathname = usePathname();
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith("/admin")) return;

    // Reset session start time on each new page
    startTime.current = Date.now();

    const sendTrack = (duration?: number) => {
      navigator.sendBeacon(
        "/api/track",
        JSON.stringify({
          pathname,
          sessionDuration: duration ?? null,
        })
      );
    };

    // Track initial page view
    sendTrack();

    // Send session duration when user leaves/navigates away
    const handleUnload = () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      sendTrack(duration);
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [pathname]);

  return null;
}
