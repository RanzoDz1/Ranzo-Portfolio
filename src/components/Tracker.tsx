"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Avoid tracking admin routes to prevent skewing analytics
    if (pathname && !pathname.startsWith("/admin")) {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname }),
      }).catch(console.error); // Silently catch errors
    }
  }, [pathname]);

  return null;
}
