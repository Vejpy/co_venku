import AnalyticsClientWrapper from "@/components/analytic/AnalyticsClientWrapper";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://covenku.cz"),
  applicationName: "CoVenku",
  alternates: {
    canonical: "/Analytics",
  },
  category: "events",
  title: "Analytika | CoVenku – Akce a aktivity ve tvém okolí",
  description:
    "Prohlédněte si analytiku kulturních míst a aktivit v aplikaci CoVenku. Statistiky událostí v Hradci Králové a okolí.",
  authors: [{ name: "CoVenku Team" }],
  creator: "CoVenku Team",
  publisher: "CoVenku",
  keywords: [
    "CoVenku",
    "analytika",
    "statistiky akcí",
    "kulturní místa",
    "akce Hradec Králové",
    "aktivity venku",
    "lokální akce",
    "Hradec Králové",
  ],
  openGraph: {
    title: "Analytika – CoVenku",
    description: "Statistiky kulturních míst a aktivit v aplikaci CoVenku.",
    url: "https://covenku.cz/Analytics",
    siteName: "CoVenku",
    locale: "cs_CZ",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CoVenku – Akce a aktivity ve tvém okolí",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Analytika – CoVenku",
    description: "Statistiky kulturních míst a aktivit v aplikaci CoVenku.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Analytika
          </h1>
          <h2 className="text-sm font-normal text-gray-500 dark:text-gray-400 mt-1">
            Přehled kulturních míst v databázi
          </h2>
        </div>

        <AnalyticsClientWrapper />
      </div>
    </div>
  );
}
