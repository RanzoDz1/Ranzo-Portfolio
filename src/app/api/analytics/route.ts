import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all";

    // Build the date filter for Prisma
    const now = new Date();
    let dateFilter = {};
    if (filter === "24h") {
      dateFilter = { visitedAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } };
    } else if (filter === "7d") {
      dateFilter = { visitedAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (filter === "30d") {
      dateFilter = { visitedAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
    }

    // Basic aggregations
    const totalViews = await prisma.visitorLog.count({ where: dateFilter });

    // Get unique visitors (unique IPs)
    const uniqueVisitorsResult = await prisma.visitorLog.groupBy({
      by: ['ipHash'],
      where: dateFilter,
    });
    const uniqueVisitors = uniqueVisitorsResult.length;

    // Device breakdown
    const devicesList = await prisma.visitorLog.groupBy({
      by: ['device'],
      where: dateFilter,
      _count: { device: true },
    });
    const devices = devicesList.map(item => ({
      name: item.device,
      count: item._count.device,
    }));

    // OS/Browser breakdown
    const browsersList = await prisma.visitorLog.groupBy({
      by: ['browser'],
      where: dateFilter,
      _count: { browser: true },
    });
    const browsers = browsersList.map(item => ({
      name: item.browser,
      count: item._count.browser,
    }));

    // Get top visited pages
    const topPagesList = await prisma.visitorLog.groupBy({
      by: ['pathname'],
      where: dateFilter,
      _count: { pathname: true },
    });
    const topPages = topPagesList
      .map(item => ({ name: item.pathname, count: item._count.pathname }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5 pages

    // Get top countries
    const topCountriesList = await prisma.visitorLog.groupBy({
      by: ['country'],
      where: dateFilter,
      _count: { country: true },
    });
    const topCountries = topCountriesList
      .map(item => ({ name: item.country || "Unknown", count: item._count.country }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent activity
    const recentLogs = await prisma.visitorLog.findMany({
      take: 20, // get top 20 instead of 10
      where: dateFilter,
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
      topCountries,
      recentLogs
    }, { status: 200 });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
