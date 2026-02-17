import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt | CoVenku",
  description: "Kontaktujte nás pro více informací, dotazy nebo spolupráci.",
  openGraph: {
    title: "Kontakt | CoVenku",
    description: "Kontaktujte nás pro více informací, dotazy nebo spolupráci.",
    url: "https://co-venku.vercel.app/Contact",
    siteName: "CoVenku",
    locale: "cs_CZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kontakt | CoVenku",
    description: "Kontaktujte nás pro více informací, dotazy nebo spolupráci.",
  },
  alternates: { canonical: "/Contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Kontaktujte nás
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Máte dotaz nebo nápad? Rádi vám odpovíme.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
