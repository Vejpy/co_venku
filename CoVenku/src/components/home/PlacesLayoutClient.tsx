"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PlaceList } from "@/components/places/PlaceList";
import { fetchCulturePlacesRaw } from "@/services/api";
import { CulturePlace } from "@/types/map";

const MapContainer = dynamic(() => import("@/components/map/MapContainer"), {
  ssr: false,
});

export default function PlacesLayoutClient() {
  const [places, setPlaces] = useState<CulturePlace[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const response = await fetchCulturePlacesRaw();
        const data = Array.isArray(response.data) ? response.data : [];
        setPlaces(data);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, []);

  return (
    <div className="flex flex-col h-full md:flex-row">
      <div className="w-full md:w-1/3 overflow-y-auto">
        <PlaceList //výpis míst v levém panelu od mapy
          places={places}
          selectedPlaceId={selectedPlaceId}
          onPlaceSelect={(placeId: number) => setSelectedPlaceId(placeId)}
          isLoading={loading}
        />
      </div>
      <div className="flex-1">
        <MapContainer selectedPlaceId={selectedPlaceId} />
      </div>
    </div>
  );
}
