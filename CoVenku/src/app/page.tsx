// page.tsx (Server Component)

import PlacesLayoutClient from "@/components/home/PlacesLayoutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://covenku.cz"),
  applicationName: "CoVenku",
  alternates: {
    canonical: "/",
  },
  category: "events",
  title: "CoVenku – Akce a aktivity ve tvém okolí",
  description:
    "CoVenku pomáhá najít zajímavé akce, místa a aktivity ve tvém okolí. Objevuj, plánuj a choď ven.",
  authors: [{ name: "CoVenku Team" }],
  creator: "CoVenku Team",
  publisher: "CoVenku",
  keywords: [
    "CoVenku",
    "akce v okolí",
    "co dělat venku",
    "události Česko",
    "volný čas",
    "aktivity venku",
    "mapa akcí",
    "lokální akce",
    "outdoor aktivity",
    "kam jít dnes",
    "Hradec Králové",
  ],
  openGraph: {
    title: "CoVenku",
    description:
      "Webová aplikace kde najdete všechny aktivity a akce v Hradci Králové",
    url: "https://covenku.cz",
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
    title: "CoVenku",
    description:
      "Webová aplikace kde najdete všechny aktivity a akce v Hradci Králové",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen relative">
      {/* SEO Headings (independent of layout) */}
      <div className="absolute top-0 left-0 w-full text-center pointer-events-none z-0">
        <h1 className="sr-only">CoVenku – Akce a aktivity ve tvém okolí</h1>
        <h2 className="sr-only">
          Objevujte kulturní akce, zajímavá místa a aktivity v Hradci Králové
        </h2>
      </div>

      {/* JSON-LD Structured Data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "CoVenku",
            url: "https://covenku.cz",
            sameAs: [
              "https://www.facebook.com/Covenku",
              "https://www.instagram.com/covenku",
              "https://www.linkedin.com/company/covenku",
              "https://www.youtube.com/@Covenku",
            ],
          }),
        }}
      />

      <PlacesLayoutClient />
    </div>
  );
}
