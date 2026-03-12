import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EventList } from "@/components/events/EventList";
import { CulturePlace } from "@/types/map";
import { CultureEvent } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7246";

async function getCulturePlace(id: string): Promise<CulturePlace | null> {
  const res = await fetch(`${BASE_URL}/api/CulturePlace/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return res.status === 404 ? null : (() => { throw new Error(); })();
  const result = await res.json();
  return result.data as CulturePlace;
}

async function getPlaceEvents(placeId: string): Promise<CultureEvent[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/CulturePlace/${placeId}/Events`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const result = await res.json();
    return Array.isArray(result.data) ? result.data : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { id } = await params;
  const place = await getCulturePlace(id);
  if (!place) return { title: "Místo nenalezeno | CoVenku" };
  return {
    title: `${place.name} | CoVenku`,
    description: place.description ?? `Kulturní místo v Hradci Králové: ${place.name}. Typ: ${place.type}.`,
    alternates: { canonical: `/places/${id}` },
    openGraph: { title: `${place.name} – CoVenku`, description: place.description ?? `Akce v ${place.name}` },
  };
}

interface PlacePageProps {
  params: Promise<{ id: string }>;
}

export default async function PlaceDetailPage({ params }: PlacePageProps) {
  const { id } = await params;
  
  // Parallel data fetching for performance
  const placePromise = getCulturePlace(id);
  const eventsPromise = getPlaceEvents(id);

  const [place, events] = await Promise.all([placePromise, eventsPromise]);

  if (!place) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Place Header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              {place.name}
            </h1>
            <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md font-medium text-zinc-700 dark:text-zinc-300">
                {place.type}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {place.address ? `${place.address.city}, ${place.address.street} ${place.address.houseNumber}` : "Adresa neznámá"}
              </span>
            </div>
          </div>
          
          {place.website && (
            <a 
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-white transition-colors"
            >
              Navštívit web
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
        
        {place.description && (
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {place.description}
            </p>
          </div>
        )}
      </div>

      {/* Associated Events Section */}
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Nadcházející události v tomto místě
      </h2>
      
      <EventList events={events} emptyMessage="Toto místo zatím neplánuje žádné události." />
    </div>
  );
}
