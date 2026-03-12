import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  fetchCurrentUser,
  fetchServerEventsByOwner,
  fetchServerEventsByUser,
  fetchServerMyOrganizations,
} from "@/services/serverApi";
import { fetchCulturePlacesRaw } from "@/services/api";
import type { CultureEvent, Organization, CulturePlace } from "@/types/api";
import UserClient from "@/components/user/UserClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://covenku.cz"),
  applicationName: "CoVenku",
  alternates: { canonical: "/user" },
  category: "user",
  title: "Uživatelský profil | CoVenku",
  description:
    "Spravujte svůj profil, oblíbená místa a sledované akce v aplikaci CoVenku.",
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
  robots: { index: false, follow: false },
};

/**
 * SSR Page — fetches all data server-side so HTML is pre-rendered.
 * NO "use client" here. Data is passed as props into the interactive shell.
 * Every fetch is defensive — API outage renders the page with empty data, never crashes.
 */
export default async function UserPage() {
  // ── Auth check (server-side, defensive — never throws) ────────────────
  const user = await fetchCurrentUser();

  if (!user) {
    redirect("/Login_Register");
  }

  // ── Parallel data fetch — wrapped in try/catch for API resilience ─────
  let ownedEvents: CultureEvent[] = [];
  let participatingEvents: CultureEvent[] = [];
  let organizations: Organization[] = [];
  let places: CulturePlace[] = [];

  try {
    const [owned, participating, orgs, placesRes] = await Promise.all([
      fetchServerEventsByOwner(user.id),
      fetchServerEventsByUser(user.id),
      fetchServerMyOrganizations(),
      fetchCulturePlacesRaw(),
    ]);
    ownedEvents = owned;
    participatingEvents = participating;
    organizations = orgs;
    places = Array.isArray(placesRes?.data)
      ? placesRes.data.filter((p: CulturePlace) => p != null)
      : [];
  } catch (error) {
    console.error(
      "User page: parallel data fetch failed →",
      error instanceof Error ? error.message : error,
    );
    // Continue with empty arrays — page still renders gracefully
  }

  return (
    <>
      {/* SEO headings rendered server-side */}
      <div className="sr-only">
        <h1>Uživatelský profil CoVenku</h1>
        <h2>Správa účtu, sledovaných míst a akcí</h2>
      </div>
      <UserClient
        initialUser={user}
        initialOwnedEvents={ownedEvents}
        initialParticipatingEvents={participatingEvents}
        initialOrganizations={organizations}
        places={places}
      />
    </>
  );
}
