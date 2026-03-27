import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pathname } = body;

    // Get anonymized IP hash
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || req.ip || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    const hash = crypto.createHash("sha256");
    hash.update(ip);
    const ipHash = hash.digest("hex");

    // Super simple device parsing
    const isMobile = /mobile/i.test(userAgent);
    const device = isMobile ? "Mobile" : "Desktop";

    // Simple browser parsing
    let browser = "Unknown";
    if (/chrome/i.test(userAgent)) browser = "Chrome";
    else if (/safari/i.test(userAgent)) browser = "Safari";
    else if (/firefox/i.test(userAgent)) browser = "Firefox";
    else if (/edge/i.test(userAgent)) browser = "Edge";

    await prisma.visitorLog.create({
      data: {
        ipHash,
        pathname: pathname || "/",
        userAgent,
        device,
        browser,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Failed to track visitor" }, { status: 500 });
  }
}
