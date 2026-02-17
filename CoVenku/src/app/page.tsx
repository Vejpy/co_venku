// page.tsx (Server Component)
import PlacesLayoutClient from "@/components/home/PlacesLayoutClient";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domů",
  description:
    "Objev akce, události a aktivity ve svém okolí. Najdi co dělat venku ještě dnes.",
  openGraph: {
    title: "CoVenku – Akce a aktivity ve tvém okolí",
    description:
      "Najdi zajímavé akce, aktivity a události ve svém okolí. Plánuj, objevuj a choď ven.",
    url: "https://co-venku.vercel.app/",
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
    title: "CoVenku – Akce a aktivity ve tvém okolí",
    description: "Najdi zajímavé akce, aktivity a události ve svém okolí.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CoVenku",
  url: "https://co-venku.vercel.app/",
  description:
    "CoVenku pomáhá najít zajímavé akce, místa a aktivity ve tvém okolí.",
  inLanguage: "cs-CZ",
  publisher: {
    "@type": "Organization",
    name: "CoVenku",
    url: "https://co-venku.vercel.app/",
    logo: {
      "@type": "ImageObject",
      url: "https://co-venku.vercel.app/og-image.png",
    },
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <PlacesLayoutClient />
    </div>
  );
}
