"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  Map,
  MapClusterLayer,
  MapPopup,
  MapControls,
} from "@/components/ui/map";
import type {
  PlaceFeatureCollection,
  PlaceFeatureProperties,
} from "@/hooks/usePlaces";
import { getPlaceTypeColor } from "@/hooks/usePlaces";
import type MapLibreGL from "maplibre-gl";
import type { Feature, Point } from "geojson";
import { useTheme } from "@/context/ThemeContext";

interface PlaceMapProps {
  geoJson: PlaceFeatureCollection;
  onPlaceClick?: (placeId: number) => void;
  selectedPlaceId?: number | null;
  className?: string;
}

interface PopupState {
  longitude: number;
  latitude: number;
  place: PlaceFeatureProperties;
}

export function PlaceMap({
  geoJson,
  onPlaceClick,
  selectedPlaceId,
  className,
}: PlaceMapProps) {
  const mapRef = useRef<MapLibreGL.Map>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const { theme } = useTheme();

  // Fly to selected place
  useEffect(() => {
    if (!mapRef.current || !selectedPlaceId) return;

    const feature = geoJson.features.find(
      (f) => f.properties.id === selectedPlaceId,
    );
    if (feature && feature.geometry.type === "Point") {
      mapRef.current.flyTo({
        center: feature.geometry.coordinates as [number, number],
        zoom: 15,
        duration: 1000,
      });

      // Show popup for selected place
      setPopup({
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        place: feature.properties,
      });
    }
  }, [selectedPlaceId, geoJson]);

  const handlePointClick = useMemo(
    () =>
      (
        feature: Feature<Point, PlaceFeatureProperties>,
        coordinates: [number, number],
      ) => {
        const props = feature.properties;

        // Show popup
        setPopup({
          longitude: coordinates[0],
          latitude: coordinates[1],
          place: props,
        });

        // Notify parent
        if (onPlaceClick) {
          onPlaceClick(props.id);
        }
      },
    [onPlaceClick],
  );

  return (
    <div className={className}>
      <Map
        ref={mapRef}
        center={[15.83, 50.21]} // Královéhradecký kraj
        zoom={11}
        theme={theme}
      >
        <MapClusterLayer<PlaceFeatureProperties>
          data={geoJson}
          clusterMaxZoom={16}
          clusterRadius={60}
          clusterColors={["#6366f1", "#8b5cf6", "#ec4899"]} // indigo, purple, pink
          clusterThresholds={[10, 50]}
          pointColor="#6366f1" // Indigo barva pro jednotlivé body
          onPointClick={handlePointClick}
        />

        {popup && (
          <MapPopup
            key={`${popup.place.id}-${popup.longitude}-${popup.latitude}`}
            longitude={popup.longitude}
            latitude={popup.latitude}
            onClose={() => setPopup(null)}
            closeButton
          >
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: getPlaceTypeColor(popup.place.type),
                  }}
                />
                <span
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: getPlaceTypeColor(popup.place.type) }}
                >
                  {popup.place.type}
                </span>
              </div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                {popup.place.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {popup.place.city}, {popup.place.street}{" "}
                {popup.place.houseNumber}
              </p>
              {popup.place.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                  {popup.place.description}
                </p>
              )}
              {popup.place.website && (
                <a
                  href={popup.place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mt-2 font-medium"
                >
                  Navštívit web →
                </a>
              )}
            </div>
          </MapPopup>
        )}

        <MapControls position="bottom-right" showZoom showLocate />
      </Map>
    </div>
  );
}

export default PlaceMap;
