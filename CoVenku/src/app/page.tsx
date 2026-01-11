import MapContainer from '@/components/map/MapContainer';

export default function HomePage() {
  return (
    <div className="relative w-full h-200vh overflow-hidden"> 
      <div className="fixed top-32 left-0 z-10 p-12 w-full max-w-4xl text-left">
        <p className="text-3xl font-extrabold leading-relaxed">
          Discover cultural venues and events around your city. From theaters, cinemas, and concert halls to sports arenas and restaurants, immerse yourself in the rich tapestry of local experiences. Scroll down to interact with the map and explore all available cultural spots in detail.
        </p>
      </div>

      <div className="relative w-full h-screen z-99 mt-150"> 
        <MapContainer markersData={[]} />
      </div>
    </div>
  );
}
