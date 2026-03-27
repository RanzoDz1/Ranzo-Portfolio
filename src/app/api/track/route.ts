import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pathname, sessionDuration } = body;

    const headersList = await headers();

    // --- IP (anonymized) ---
    const forwarded = headersList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

    // --- User Agent ---
    const userAgent = headersList.get("user-agent") || "unknown";

    // --- Device ---
    const isMobile = /mobile/i.test(userAgent);
    const isTablet = /tablet|ipad/i.test(userAgent);
    const device = isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop";

    // --- Browser (more detailed) ---
    let browser = "Other";
    if (/edg\//i.test(userAgent)) browser = "Edge";
    else if (/opr\//i.test(userAgent)) browser = "Opera";
    else if (/chrome/i.test(userAgent)) browser = "Chrome";
    else if (/firefox/i.test(userAgent)) browser = "Firefox";
    else if (/safari/i.test(userAgent)) browser = "Safari";

    // --- OS ---
    let os = "Other";
    if (/windows/i.test(userAgent)) os = "Windows";
    else if (/android/i.test(userAgent)) os = "Android";
    else if (/iphone|ipad/i.test(userAgent)) os = "iOS";
    else if (/mac os/i.test(userAgent)) os = "macOS";
    else if (/linux/i.test(userAgent)) os = "Linux";

    // --- Location (Vercel native edge headers) ---
    const country = headersList.get("x-vercel-ip-country") || null;
    const cityRaw = headersList.get("x-vercel-ip-city") || null;
    const city = cityRaw ? decodeURIComponent(cityRaw) : null;

    // --- Referrer (domain only, private-safe) ---
    const refHeader = headersList.get("referer") || null;
    let referrer: string | null = null;
    if (refHeader) {
      try {
        const refUrl = new URL(refHeader);
        const host = refUrl.hostname.replace(/^www\./, "");
        referrer = refUrl.hostname.includes(req.headers.get("host") || "ranzodz.com")
          ? "Direct"
          : host;
      } catch {
        referrer = "Direct";
      }
    } else {
      referrer = "Direct";
    }

    // --- Language ---
    const acceptLang = headersList.get("accept-language") || null;
    const language = acceptLang ? acceptLang.split(",")[0].trim() : null;

    await prisma.visitorLog.create({
      data: {
        ipHash,
        pathname: pathname || "/",
        userAgent,
        device,
        browser,
        os,
        country,
        city,
        referrer,
        language,
        sessionDuration: typeof sessionDuration === "number" ? Math.round(sessionDuration) : null,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Failed to track visitor" }, { status: 500 });
  }
}
