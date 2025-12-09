import { MarkerData, CulturePlaceResponse, CulturePlace } from '../types/map';

// Fetches markers from the backend API and converts them into MarkerData
export async function fetchMarkers(): Promise<MarkerData[]> {
  console.log('Fetching markers from API...');
  const response = await fetch('http://172.26.10.213:7247/api/CulturePlace/All');
  const data: CulturePlaceResponse = await response.json();
  console.log('Raw API data:', data);

  // Map API data to MarkerData
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
    console.log('Mapped marker:', mappedMarker);
    return mappedMarker;
  });
}