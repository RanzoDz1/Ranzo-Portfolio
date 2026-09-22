"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });

export default function CursorWrapper() {
  const pathname = usePathname();
  // The portfolio page uses the native cursor for snappier interaction
  if (pathname?.startsWith("/portfolio")) return null;
  return <CustomCursor />;
}
