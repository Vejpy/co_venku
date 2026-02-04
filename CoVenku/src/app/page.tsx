// page.tsx (Server Component)
import PlacesLayoutClient from "@/components/home/PlacesLayoutClient";

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen">
      <PlacesLayoutClient />
    </div>
  );
}
