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
  const [places, setPlaces] = useState<any[]>([]);
  const [markersData, setMarkersData] = useState<any>({
    type: "FeatureCollection",
    features: [],
  });
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const response = await fetchCulturePlacesRaw();
        const data = Array.isArray(response.data) ? response.data : [];

        setPlaces(data);

        const features = data
          .filter(
            (p: CulturePlace) =>
              p.address?.lat != null && p.address?.lon != null,
          )
          .map((p: CulturePlace) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [p.address.lon, p.address.lat],
            },
            properties: { id: p.id, name: p.name, description: p.description },
          }));

        setMarkersData({ type: "FeatureCollection", features });
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, []);

  return (
    <div className="flex flex-col h-full md:flex-row">
      <div className="w-full md:w-1/3 overflow-y-auto">
        <PlaceList
          places={places}
          selectedPlaceId={selectedPlaceId}
          onPlaceSelect={setSelectedPlaceId}
          isLoading={loading}
          error={error}
        />
      </div>
      <div className="flex-1">
        <MapContainer markersData={markersData} />
      </div>
    </div>
  );
}
