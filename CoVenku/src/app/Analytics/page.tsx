import PlaceCard from "@/components/place/PlaceCard";
import { Place } from "@/types/place";
import { fetchPlaces } from "@/data/placesData";

export default async function PlacesPage() {
  const places: Place[] = await fetchPlaces();

  return (
    <div className="flex-col h-full min-h-full flex justify-center pt-20 px-6">
      <div className="flex flex-wrap gap-6 justify-center max-w-7xl w-full">
        {places.map((place) => (
          <div key={place.id} className="cursor-pointer">
            <PlaceCard
              imageUrl={place.imageUrl}
              name={place.name}
              visitors={place.visitors}
            />
          </div>
        ))}
      </div>
    </div>
  );
}