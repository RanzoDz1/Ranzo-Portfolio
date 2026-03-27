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

    // Get top visited pages
    const topPagesList = await prisma.visitorLog.groupBy({
      by: ['pathname'],
      _count: { pathname: true },
    });
    const topPages = topPagesList
      .map(item => ({ name: item.pathname, count: item._count.pathname }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5 pages

    // Recent activity
    const recentLogs = await prisma.visitorLog.findMany({
      take: 20, // get top 20 instead of 10
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
      topPages,
      recentLogs
    }, { status: 200 });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
