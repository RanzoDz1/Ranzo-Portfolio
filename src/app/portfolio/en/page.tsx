import type { Metadata } from "next";
import PortfolioClient from "../PortfolioClient";

export const metadata: Metadata = {
  title: "Abdullah Khalfi | Web Developer, Freiburg, Germany",
  description:
    "Portfolio of Abdullah Khalfi: platforms, websites and online shops built with React, Next.js and TypeScript.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://ranzo.dev/portfolio/en" },
};

export default function PortfolioPageEn() {
  return <PortfolioClient lang="en" />;
}
