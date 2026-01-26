"use client";

import { useState, useEffect, useMemo } from "react";
import type { CultureEvent } from "@/types/api";
import { getEvents } from "@/lib/api-client";
import type { FeatureCollection, Feature, Point } from "geojson";

// Properties pro GeoJSON Feature
export interface EventFeatureProperties {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  organizer: string;
  city: string;
  street: string;
  houseNumber: string;
}

export type EventFeature = Feature<Point, EventFeatureProperties>;
export type EventFeatureCollection = FeatureCollection<
  Point,
  EventFeatureProperties
>;

export interface UseEventsResult {
  events: CultureEvent[];
  geoJson: EventFeatureCollection;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pro načtení eventů a jejich transformaci na GeoJSON pro MapLibre
 */
export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<CultureEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch events"),
      );
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Transformace na GeoJSON - filtruje eventy bez validních souřadnic
  const geoJson = useMemo<EventFeatureCollection>(() => {
    const features: EventFeature[] = events
      .filter((event) => {
        // Ověř, že Address existuje a má platné souřadnice
        return (
          event.Address &&
          event.Address.Lat !== null &&
          event.Address.Lon !== null &&
          typeof event.Address.Lat === "number" &&
          typeof event.Address.Lon === "number" &&
          !isNaN(event.Address.Lat) &&
          !isNaN(event.Address.Lon)
        );
      })
      .map((event) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [event.Address.Lon!, event.Address.Lat!], // [lng, lat] - GeoJSON format
        },
        properties: {
          id: event.Id,
          name: event.Name,
          description: event.Description,
          startDate: event.StartDate,
          endDate: event.EndDate,
          organizer: event.Organizer,
          city: event.Address.City,
          street: event.Address.Street,
          houseNumber: event.Address.HouseNumber,
        },
      }));

    return {
      type: "FeatureCollection" as const,
      features,
    };
  }, [events]);

  return {
    events,
    geoJson,
    isLoading,
    error,
    refetch: fetchEvents,
  };
}

/**
 * Helper pro formátování data
 */
export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Helper pro formátování kratšího data (jen datum bez času)
 */
export function formatEventDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "short",
  });
}
