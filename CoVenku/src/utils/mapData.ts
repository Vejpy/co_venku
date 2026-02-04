import { MarkerData, CulturePlaceResponse, CulturePlace } from "../types/map";
import { fetchCulturePlacesRaw } from "@/services/api";

export async function fetchMarkers(): Promise<MarkerData[]> {
  console.log("Fetching markers from API...");

  const data: CulturePlaceResponse = await fetchCulturePlacesRaw();
  console.log("Raw API data:", data);

  if (!data || !data.data || !Array.isArray(data.data)) {
    console.warn("API data is missing or not an array.");
    return [];
  }

  const filteredPlaces = data.data.filter((place: CulturePlace) => {
    if (
      !place.address ||
      place.address.lat === undefined ||
      place.address.lon === undefined ||
      place.address.lat === null ||
      place.address.lon === null
    ) {
      return false;
    }
    const lat = Number(place.address.lat);
    const lon = Number(place.address.lon);
    if (isNaN(lat) || isNaN(lon)) {
      return false;
    }
    return true;
  });

  return filteredPlaces.map((place: CulturePlace) => {
    let imageUrl: string | undefined = undefined;
    if (typeof place.else === "string" && place.else.trim() !== "") {
      try {
        const elseData = JSON.parse(place.else);
        if (elseData && typeof elseData.Image === "string") {
          imageUrl = elseData.Image;
        }
      } catch {
        // Silently ignore JSON parse errors
      }
    }

    const mappedMarker: MarkerData = {
      name: place.name,
      id: place.id,
      title: place.name,
      description: place.description,
      imageUrl,
      type: place.type,
      number: place.id,
      position: [Number(place.address.lat), Number(place.address.lon)],
    };

    console.log("Mapped marker:", mappedMarker);
    return mappedMarker;
  });
}
