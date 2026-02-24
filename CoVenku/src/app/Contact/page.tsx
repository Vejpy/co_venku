import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://covenku.cz"),
  applicationName: "CoVenku",
  alternates: {
    canonical: "/Contact",
  },
  category: "events",
  title: "Kontakt | CoVenku – Akce a aktivity ve tvém okolí",
  description:
    "Kontaktujte tým CoVenku. Máte dotaz, nápad nebo chcete přidat akci v Hradci Králové? Napište nám.",
  authors: [{ name: "CoVenku Team" }],
  creator: "CoVenku Team",
  publisher: "CoVenku",
  keywords: [
    "CoVenku",
    "kontakt",
    "kontakt CoVenku",
    "akce Hradec Králové",
    "dotaz CoVenku",
    "podpora CoVenku",
    "lokální akce",
    "Hradec Králové",
  ],
  openGraph: {
    title: "Kontakt – CoVenku",
    description:
      "Kontaktujte CoVenku a zjistěte více o akcích a aktivitách v Hradci Králové.",
    url: "https://covenku.cz/Contact",
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
    title: "Kontakt – CoVenku",
    description:
      "Kontaktujte CoVenku a zjistěte více o akcích a aktivitách v Hradci Králové.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Kontaktujte nás
          </h1>
          <h2 className="text-base font-normal text-gray-500 dark:text-gray-400 mt-2">
            Máte dotaz nebo nápad? Rádi vám odpovíme.
          </h2>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
