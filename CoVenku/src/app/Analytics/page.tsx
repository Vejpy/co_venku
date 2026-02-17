import AnalyticsClientWrapper from "@/components/analytic/AnalyticsClientWrapper";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | CoVenku",
  description:
    "Prohlédněte si analytiku a statistiky aktivit a událostí na CoVenku.",
  openGraph: {
    title: "Analytics | CoVenku",
    description:
      "Prohlédněte si analytiku a statistiky aktivit a událostí na CoVenku.",
    url: "https://co-venku.vercel.app/Analytics",
    siteName: "CoVenku",
    locale: "cs_CZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Analytics | CoVenku",
    description:
      "Prohlédněte si analytiku a statistiky aktivit a událostí na CoVenku.",
  },
  alternates: { canonical: "/Analytics" },
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <AnalyticsClientWrapper />
      </div>
    </div>
  );
}
