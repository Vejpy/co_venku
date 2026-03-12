import React from "react";
import EntitiesManagementClient from "@/components/admin/EntitiesManagementClient";
import { fetchServerPendingOrganizations } from "@/services/serverApi";
import { fetchCulturePlacesRaw, fetchAllEvents } from "@/services/api";
import type { CultureEvent, Organization, CulturePlace } from "@/types/api";

export const metadata = {
  title: "Správa entit | Administrace",
  description: "Správa událostí, kulturních míst a schvalování organizátorů.",
};

export default async function AdminEntitiesPage() {
  let places: CulturePlace[] = [];
  let events: CultureEvent[] = [];
  let pendingOrganizers: { id: number; name: string; ico: string; email: string; }[] = [];
  
  try {
    const [placesRes, eventsRes, orgsRes] = await Promise.all([
      fetchCulturePlacesRaw(),
      fetchAllEvents(),
      fetchServerPendingOrganizations(),
    ]);
    
    places = Array.isArray(placesRes?.data) ? placesRes.data as CulturePlace[] : [];
    events = Array.isArray(eventsRes?.data) ? eventsRes.data as CultureEvent[] : [];
    pendingOrganizers = orgsRes.map((o: Organization) => ({
      id: o.id,
      name: o.name || "",
      ico: o.ico || "",
      email: o.contactEmail || ""
    }));
  } catch (error) {
    console.error("Failed to fetch entities for admin", error);
  }

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Agendy a Entity</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Správa kulturních událostí, globálních míst a posuzování žádostí organizátorů.
        </p>
      </header>

      <EntitiesManagementClient 
        events={events} 
        places={places} 
        pendingOrganizers={pendingOrganizers} 
      />
    </article>
  );
}
