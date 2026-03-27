import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all";

    const now = new Date();
    let dateFilter: any = {};
    if (filter === "24h") {
      dateFilter = { visitedAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } };
    } else if (filter === "7d") {
      dateFilter = { visitedAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (filter === "30d") {
      dateFilter = { visitedAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
    }

    // --- Basic counts ---
    const totalViews = await prisma.visitorLog.count({ where: dateFilter });
    const uniqueVisitorsResult = await prisma.visitorLog.groupBy({ by: ["ipHash"], where: dateFilter });
    const uniqueVisitors = uniqueVisitorsResult.length;

    // --- New vs Returning ---
    // "New" = visitors whose first visit is within the current filter window
    const allTimeVisitors = await prisma.visitorLog.groupBy({ by: ["ipHash"] });
    const allTimeSet = new Set(allTimeVisitors.map((v) => v.ipHash));
    const windowVisitors = uniqueVisitorsResult.map((v) => v.ipHash);
    const returningVisitors = windowVisitors.filter((h) => {
      // If this hash exists outside the filter window too, they're returning
      return true; // We'll compute properly below
    }).length;

    // Get visitors who have visits BEFORE the filter window
    let newVisitors = uniqueVisitors;
    let returningCount = 0;
    if (filter !== "all") {
      const windowStart = dateFilter.visitedAt?.gte;
      if (windowStart) {
        const beforeWindow = await prisma.visitorLog.groupBy({
          by: ["ipHash"],
          where: { visitedAt: { lt: windowStart } },
        });
        const beforeSet = new Set(beforeWindow.map((v) => v.ipHash));
        returningCount = windowVisitors.filter((h) => beforeSet.has(h)).length;
        newVisitors = uniqueVisitors - returningCount;
      }
    }

    // --- Average session duration ---
    const sessionData = await prisma.visitorLog.aggregate({
      where: { ...dateFilter, sessionDuration: { not: null } },
      _avg: { sessionDuration: true },
      _count: { sessionDuration: true },
    });
    const avgSession = sessionData._avg.sessionDuration
      ? Math.round(sessionData._avg.sessionDuration)
      : null;

    // --- Device breakdown ---
    const devicesList = await prisma.visitorLog.groupBy({
      by: ["device"], where: dateFilter, _count: { device: true },
    });
    const devices = devicesList.map((item) => ({ name: item.device, count: item._count.device }));

    // --- Browser breakdown ---
    const browsersList = await prisma.visitorLog.groupBy({
      by: ["browser"], where: dateFilter, _count: { browser: true },
    });
    const browsers = browsersList.map((item) => ({ name: item.browser, count: item._count.browser }));

    // --- OS breakdown ---
    const osList = await prisma.visitorLog.groupBy({
      by: ["os"], where: { ...dateFilter, os: { not: null } }, _count: { os: true },
    });
    const operatingSystems = osList.map((item) => ({ name: item.os || "Unknown", count: item._count.os }))
      .sort((a, b) => b.count - a.count);

    // --- Top pages ---
    const topPagesList = await prisma.visitorLog.groupBy({
      by: ["pathname"], where: dateFilter, _count: { pathname: true },
    });
    const topPages = topPagesList
      .map((item) => ({ name: item.pathname, count: item._count.pathname }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // --- Top countries ---
    const topCountriesList = await prisma.visitorLog.groupBy({
      by: ["country"], where: { ...dateFilter, country: { not: null } }, _count: { country: true },
    });
    const topCountries = topCountriesList
      .map((item) => ({ name: item.country || "Unknown", count: item._count.country }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // --- Top referrers ---
    const referrerList = await prisma.visitorLog.groupBy({
      by: ["referrer"], where: { ...dateFilter, referrer: { not: null } }, _count: { referrer: true },
    });
    const topReferrers = referrerList
      .map((item) => ({ name: item.referrer || "Direct", count: item._count.referrer }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // --- Top languages ---
    const languageList = await prisma.visitorLog.groupBy({
      by: ["language"], where: { ...dateFilter, language: { not: null } }, _count: { language: true },
    });
    const topLanguages = languageList
      .map((item) => ({ name: item.language || "Unknown", count: item._count.language }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // --- Peak traffic hours (0-23) ---
    const allLogs = await prisma.visitorLog.findMany({
      where: dateFilter,
      select: { visitedAt: true },
    });
    const hourBuckets: Record<number, number> = {};
    for (let i = 0; i < 24; i++) hourBuckets[i] = 0;
    for (const log of allLogs) {
      const hour = new Date(log.visitedAt).getHours();
      hourBuckets[hour] = (hourBuckets[hour] || 0) + 1;
    }
    const peakHours = Object.entries(hourBuckets)
      .map(([hour, count]) => ({ hour: Number(hour), count }))
      .sort((a, b) => a.hour - b.hour);

    // --- Recent logs (20 latest) ---
    const recentLogs = await prisma.visitorLog.findMany({
      take: 20,
      where: dateFilter,
      orderBy: { visitedAt: "desc" },
      select: {
        pathname: true,
        device: true,
        browser: true,
        os: true,
        country: true,
        city: true,
        referrer: true,
        language: true,
        sessionDuration: true,
        visitedAt: true,
      },
    });

    return NextResponse.json({
      totalViews,
      uniqueVisitors,
      newVisitors,
      returningVisitors: returningCount,
      avgSession,
      devices,
      browsers,
      operatingSystems,
      topPages,
      topCountries,
      topReferrers,
      topLanguages,
      peakHours,
      recentLogs,
    }, { status: 200 });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
