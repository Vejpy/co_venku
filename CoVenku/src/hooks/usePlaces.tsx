"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { CulturePlace, CulturePlaceResponse } from "@/types/map";
import { fetchCulturePlacesRaw } from "@/services/api";
import type { FeatureCollection, Feature, Point } from "geojson";

// Properties pro GeoJSON Feature
export interface PlaceFeatureProperties {
  id: number;
  name: string;
  description: string | undefined;
  website: string | undefined;
  type: string;
  city: string;
  street: string;
  houseNumber: string;
  imageUrl?: string;
}

export type PlaceFeature = Feature<Point, PlaceFeatureProperties>;
export type PlaceFeatureCollection = FeatureCollection<
  Point,
  PlaceFeatureProperties
>;

export interface UsePlacesResult {
  places: CulturePlace[];
  geoJson: PlaceFeatureCollection;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pro načtení kulturních míst a jejich transformaci na GeoJSON pro MapLibre
 */
export function usePlaces(): UsePlacesResult {
  const [places, setPlaces] = useState<CulturePlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlaces = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: CulturePlaceResponse = await fetchCulturePlacesRaw();
      setPlaces(response.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch places"),
      );
      console.error("Error fetching places:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // Transformace na GeoJSON - filtruje místa bez validních souřadnic
  const geoJson = useMemo<PlaceFeatureCollection>(() => {
    const features: PlaceFeature[] = places
      .filter((place) => {
        // Ověř, že address existuje a má platné souřadnice
        return (
          place.address &&
          place.address.lat !== null &&
          place.address.lon !== null &&
          typeof place.address.lat === "number" &&
          typeof place.address.lon === "number" &&
          !isNaN(place.address.lat) &&
          !isNaN(place.address.lon)
        );
      })
      .map((place) => {
        // Parse imageUrl from else field if exists
        let imageUrl: string | undefined;
        if (place.else) {
          try {
            const parsed = JSON.parse(place.else);
            imageUrl = parsed.Image;
          } catch {
            // ignore parse error
          }
        }

        return {
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: [place.address.lon, place.address.lat], // [lng, lat] - GeoJSON format
          },
          properties: {
            id: place.id,
            name: place.name,
            description: place.description,
            website: place.webUrl || place.website,
            type: place.type,
            city: place.address.city,
            street: place.address.street,
            houseNumber: place.address.houseNumber,
            imageUrl,
          },
        };
      });

    return {
      type: "FeatureCollection" as const,
      features,
    };
  }, [places]);

  return {
    places,
    geoJson,
    isLoading,
    error,
    refetch: fetchPlaces,
  };
}

/**
 * Helper pro získání barvy podle typu místa
 */
export function getPlaceTypeColor(type: string): string {
  const normalizedType = type.toLowerCase();
  const colors: Record<string, string> = {
    divadlo: "#e74c3c",
    kino: "#9b59b6",
    muzeum: "#3498db",
    galerie: "#1abc9c",
    "koncertní síň": "#f39c12",
    knihovna: "#2ecc71",
    "kulturní dům": "#e67e22",
    default: "#6366f1",
  };
  return colors[normalizedType] || colors["default"];
}

/**
 * SVG ikony podle typu místa (profesionální, bez emoji)
 */
export const placeTypeIcons: Record<string, React.ReactNode> = {
  divadlo: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      <path d="M2 12C2 6.5 6.5 2 12 2s10 4.5 10 10-4.5 10-10 10S2 17.5 2 12zm5.5-2c.83 0 1.5-.67 1.5-1.5S8.33 7 7.5 7 6 7.67 6 8.5 6.67 10 7.5 10zm9 0c.83 0 1.5-.67 1.5-1.5S17.33 7 16.5 7 15 7.67 15 8.5s.67 1.5 1.5 1.5zM12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
    </svg>
  ),
  kino: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
    </svg>
  ),
  muzeum: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v2h20V7L12 2zm0 2.5L17.5 7h-11L12 4.5zM2 22h20v-2H2v2zm2-3h2v-7H4v7zm4 0h2v-7H8v7zm4 0h2v-7h-2v7zm4 0h2v-7h-2v7z" />
    </svg>
  ),
  galerie: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
    </svg>
  ),
  "koncertní síň": (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  ),
  knihovna: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
    </svg>
  ),
  "kulturní dům": (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm0 8.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  ),
};

/**
 * Helper pro získání ikony podle typu místa
 */
export function getPlaceTypeIcon(type: string): React.ReactNode {
  const normalizedType = type.toLowerCase();
  return placeTypeIcons[normalizedType] || placeTypeIcons["default"];
}
