import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://covenku.cz"),
  applicationName: "CoVenku",
  alternates: {
    canonical: "/user",
  },
  category: "user",
  title: "Uživatelský profil | CoVenku",
  description: "Spravujte svůj profil, oblíbená místa a sledované akce v aplikaci CoVenku.",
  authors: [{ name: "CoVenku Team" }],
  creator: "CoVenku Team",
  publisher: "CoVenku",
  keywords: [
    "CoVenku",
    "profil",
    "uživatel",
    "sledované akce",
    "oblíbená místa",
    "Hradec Králové",
  ],
  openGraph: {
    title: "Uživatelský profil – CoVenku",
    description: "Správa účtu, sledovaných míst a akcí v aplikaci CoVenku.",
    url: "https://covenku.cz/user",
    siteName: "CoVenku",
    locale: "cs_CZ",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CoVenku – Uživatelský profil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uživatelský profil – CoVenku",
    description: "Správa účtu, sledovaných míst a akcí v aplikaci CoVenku.",
    images: ["/og-image.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
};

import { Suspense } from "react";
import UserClient from "@/components/user/UserClient";

export default function UserPage() {
  return (
    <>
      <div className="sr-only">
        <h1>Uživatelský profil CoVenku</h1>
        <h2>Správa účtu, sledovaných míst a akcí</h2>
      </div>
      <Suspense fallback={<div className="pt-20 text-center">Načítání profilu...</div>}>
        <UserClient />
      </Suspense>
    </>
  );
}