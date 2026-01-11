import { MarkerData, CulturePlaceResponse, CulturePlace } from "../types/map";
import { fetchCulturePlacesRaw } from "@/services/api";

export async function fetchMarkers(): Promise<MarkerData[]> {
  console.log("Fetching markers from API...");

  const data: CulturePlaceResponse = await fetchCulturePlacesRaw();
  console.log("Raw API data:", data);

  return data.data.map((place: CulturePlace) => {
    const mappedMarker: MarkerData = {
      id: place.id,
      title: place.name,
      description: place.description,
      imageUrl: place.else ? JSON.parse(place.else).Image : undefined,
      type: place.type,
      number: place.id,
      position: [Number(place.address.lat), Number(place.address.lon)],
    };

    console.log("Mapped marker:", mappedMarker);
    return mappedMarker;
  });
}