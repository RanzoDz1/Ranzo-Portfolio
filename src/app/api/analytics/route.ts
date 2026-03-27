import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get total views
    const totalViews = await prisma.visitorLog.count();

    // Get unique visitors (unique IPs)
    const uniqueVisitorsResult = await prisma.visitorLog.groupBy({
      by: ['ipHash'],
    });
    const uniqueVisitors = uniqueVisitorsResult.length;

    // Get devices breakdown
    const devicesList = await prisma.visitorLog.groupBy({
      by: ['device'],
      _count: { device: true },
    });
    const devices = devicesList.map(item => ({
      name: item.device,
      count: item._count.device,
    }));

    // Get browser breakdown
    const browsersList = await prisma.visitorLog.groupBy({
      by: ['browser'],
      _count: { browser: true },
    });
    const browsers = browsersList.map(item => ({
      name: item.browser,
      count: item._count.browser,
    }));

    // Recent activity
    const recentLogs = await prisma.visitorLog.findMany({
      take: 10,
      orderBy: { visitedAt: 'desc' },
      select: {
        pathname: true,
        device: true,
        browser: true,
        visitedAt: true,
      }
    });

    return NextResponse.json({
      totalViews,
      uniqueVisitors,
      devices,
      browsers,
      recentLogs
    }, { status: 200 });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
