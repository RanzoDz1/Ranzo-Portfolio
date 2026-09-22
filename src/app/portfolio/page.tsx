import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Abdullah Khalfi | Webentwickler aus Freiburg",
  description:
    "Portfolio von Abdullah Khalfi: Plattformen, Websites und Onlineshops mit React, Next.js und TypeScript.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://ranzo.dev/portfolio" },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
