"use client";

import { useEffect, useRef, useState } from "react";
import {
  Map,
  MapClusterLayer,
  MapPopup,
  MapControls,
} from "@/components/ui/map";
import type {
  EventFeatureCollection,
  EventFeatureProperties,
} from "@/hooks/useEvents";
import { formatEventDate } from "@/hooks/useEvents";
import type MapLibreGL from "maplibre-gl";
import type { Feature, Point } from "geojson";

interface EventMapProps {
  geoJson: EventFeatureCollection;
  onEventClick?: (eventId: number) => void;
  selectedEventId?: number | null;
  className?: string;
}

interface PopupState {
  longitude: number;
  latitude: number;
  event: EventFeatureProperties;
}

export function EventMap({
  geoJson,
  onEventClick,
  selectedEventId,
  className,
}: EventMapProps) {
  const mapRef = useRef<MapLibreGL.Map>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);

  // Fly to selected event
  useEffect(() => {
    if (!mapRef.current || !selectedEventId) return;

    const feature = geoJson.features.find(
      (f) => f.properties.id === selectedEventId,
    );
    if (feature && feature.geometry.type === "Point") {
      mapRef.current.flyTo({
        center: feature.geometry.coordinates as [number, number],
        zoom: 15,
        duration: 1000,
      });

      // Show popup for selected event
      setPopup({
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        event: feature.properties,
      });
    }
  }, [selectedEventId, geoJson]);

  const handlePointClick = (
    feature: Feature<Point, EventFeatureProperties>,
    coordinates: [number, number],
  ) => {
    const props = feature.properties;

    // Show popup
    setPopup({
      longitude: coordinates[0],
      latitude: coordinates[1],
      event: props,
    });

    // Notify parent
    if (onEventClick) {
      onEventClick(props.id);
    }
  };

  return (
    <div className={className}>
      <Map
        ref={mapRef}
        center={[15.5, 49.8]} // Střed ČR
        zoom={7}
        theme="light"
      >
        <MapClusterLayer<EventFeatureProperties>
          data={geoJson}
          clusterMaxZoom={14}
          clusterRadius={50}
          clusterColors={["#51bbd6", "#f1c40f", "#e74c3c"]} // light blue, yellow, red
          clusterThresholds={[10, 30]}
          pointColor="#ff0000" // Červená barva pro jednotlivé body
          onPointClick={handlePointClick}
        />

        {popup && (
          <MapPopup
            longitude={popup.longitude}
            latitude={popup.latitude}
            onClose={() => setPopup(null)}
            closeButton
          >
            <div className="max-w-xs">
              <h3 className="font-bold text-sm mb-1">{popup.event.name}</h3>
              <p className="text-xs text-gray-600 mb-1">
                {formatEventDate(popup.event.startDate)}
              </p>
              <p className="text-xs text-gray-500">
                {popup.event.city}, {popup.event.street}{" "}
                {popup.event.houseNumber}
              </p>
              {popup.event.organizer && (
                <p className="text-xs text-gray-400 mt-1">
                  Pořadatel: {popup.event.organizer}
                </p>
              )}
            </div>
          </MapPopup>
        )}

        <MapControls position="bottom-right" showZoom showLocate />
      </Map>
    </div>
  );
}

export default EventMap;
