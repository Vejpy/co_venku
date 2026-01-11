import { Place } from "@/types/place";
import { fetchCulturePlacesRaw } from "@/services/api";

const PLACEHOLDER_IMAGE = "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyds45Et4mGVydFUxhYmRjc-h-NMXgOy6bf7I6i3CY1KY-YRSOx9uWG_T0nu3PwXPteE6xDtNbOcwykbwJnwr-4ISDG0xzwTRw8on6tbCoMclMZrkjLgWiUyBf_LINg24Tjbh3dg=s1360-w1360-h1020";

interface ApiPlace {
  id: number;
  name: string;
  description?: string;
  else?: string;
}

export async function fetchPlaces(): Promise<Place[]> {
  const data = await fetchCulturePlacesRaw();

  return data.data.map((item: ApiPlace) => {
    let imageUrl = PLACEHOLDER_IMAGE;
    if (item.else) {
      try {
        const parsed = JSON.parse(item.else);
        if (parsed.Image && parsed.Image.trim() !== "") {
          imageUrl = parsed.Image;
        }
      } catch (e) {
        console.error("Error parsing 'else' field for item:", item, e);
      }
    }

    return {
      id: item.id,
      name: item.name,
      description: item.description || "",
      imageUrl,
      visitors: 0,
    };
  });
}
