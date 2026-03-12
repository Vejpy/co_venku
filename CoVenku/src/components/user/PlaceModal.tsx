"use client";

import { useState, useEffect, useMemo } from "react";
import { X, MapPin, Type, FileText, Globe, Info, Search, Calendar } from "lucide-react";
import { toast } from "sonner";
import { createCulturePlace, updateCulturePlace, createAddress } from "@/services/api";
import { CulturePlace, CulturePlaceRequest } from "@/types/api";
import { Map, MapMarker, MarkerContent, useMap, MapControls } from "@/components/ui/map";
import { cn } from "@/lib/utils";

// Map click handler to pick lat/lon
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lon: number) => void }) {
  const { map } = useMap();
  useEffect(() => {
    if (!map) return;
    const clickHandler = (e: { lngLat: { lat: number; lng: number } }) => onLocationSelect(e.lngLat.lat, e.lngLat.lng);
    map.on("click", clickHandler);
    return () => {
      map.off("click", clickHandler);
    };
  }, [map, onLocationSelect]);
  return null;
}

interface PlaceModalProps {
  organizationId: number;
  existingPlace?: CulturePlace;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PlaceModal({ organizationId, existingPlace, onClose, onSuccess }: PlaceModalProps) {
  const [loading, setLoading] = useState(false);
  
  // Place Details
  const [formData, setFormData] = useState({
    name: existingPlace?.name || "",
    type: existingPlace?.type || "",
    description: existingPlace?.description || "",
    webUrl: existingPlace?.webUrl || "",
    other: existingPlace?.other || "",
  });

  // Address Details
  const [addressData, setAddressData] = useState({
    city: existingPlace?.address?.city || "",
    street: existingPlace?.address?.street || "",
    houseNumber: existingPlace?.address?.houseNumber || "",
    zipCode: existingPlace?.address?.zipCode || "",
  });

  const [lat, setLat] = useState<number | null>(existingPlace?.lat ?? 50.20923);
  const [lon, setLon] = useState<number | null>(existingPlace?.lon ?? 15.83277);

  const [addressSearch, setAddressSearch] = useState("");
  const [suggestions, setSuggestions] = useState<{ address: { city?: string; town?: string; village?: string; road?: string; house_number?: string; postcode?: string }; lat: string; lon: string; display_name: string }[]>([]);
  const [searching, setSearching] = useState(false);

  // Focus map roughly on CZ if new
  const center: [number, number] = useMemo(() => [lon ?? 15.83277, lat ?? 50.20923], [lon, lat]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData(prev => ({ ...prev, [name]: value }));
  };

  const searchAddress = async (query: string) => {
    if (query.length < 3) return;
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=cz`);
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Search error", error);
    } finally {
      setSearching(false);
    }
  };

  const selectSuggestion = (s: { address: { city?: string; town?: string; village?: string; road?: string; house_number?: string; postcode?: string }; lat: string; lon: string; display_name: string }) => {
    setAddressData({
      city: s.address.city || s.address.town || s.address.village || "",
      street: s.address.road || "",
      houseNumber: s.address.house_number || "",
      zipCode: s.address.postcode || "",
    });
    setLat(parseFloat(s.lat));
    setLon(parseFloat(s.lon));
    setSuggestions([]);
    setAddressSearch(s.display_name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lat || !lon) {
      toast.error("Prosím, vyberte pozici na mapě.");
      return;
    }

    setLoading(true);
    try {
      let addressId = existingPlace?.address?.id;
      
      const hasAddressChanged = 
        !addressId ||
        addressData.city !== existingPlace?.address?.city ||
        addressData.street !== existingPlace?.address?.street ||
        addressData.houseNumber !== existingPlace?.address?.houseNumber ||
        addressData.zipCode !== existingPlace?.address?.zipCode ||
        lat !== existingPlace?.lat ||
        lon !== existingPlace?.lon;

      if (hasAddressChanged) {
        const addrRes = await createAddress({
          ...addressData,
          street: addressData.street || "",
          houseNumber: String(addressData.houseNumber).replace(/[^\d].*/, ""), // Strip slashes and non-numeric suffixes
          lat,
          lon,
          regionId: existingPlace?.address?.regionId || 1,
        });
        if (addrRes.data) {
          addressId = addrRes.data.id;
        } else {
          throw new Error("Nepodařilo se vytvořit adresu.");
        }
      }

      if (!addressId) throw new Error("ID adresy není dostupné.");

      const payload: CulturePlaceRequest = {
        ...formData,
        addressId,
        organizationId,
      };

      if (existingPlace) {
        await updateCulturePlace(existingPlace.id, payload);
        toast.success("Místo bylo úspěšně upraveno.");
      } else {
        await createCulturePlace(payload);
        toast.success("Nové místo bylo úspěšně založeno.");
      }
      onSuccess();
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } }).response?.data?.message || "Došlo k chybě při ukládání místa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-md p-4 lg:p-8 animate-in fade-in duration-300">
      <div className="w-full max-w-6xl h-full max-h-[90vh] bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {existingPlace ? "Upravit kulturní místo" : "Nové kulturní místo"}
              </h2>
              <p className="text-xs text-zinc-500 font-medium">
                {existingPlace ? "Aktualizujte detaily vaší lokace" : "Založte nové místo pro vaše akce"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* Left: Map (70%) */}
          <div className="lg:flex-[7] relative bg-zinc-100 dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800">
            {/* Address Search Overlay */}
            <div className="absolute top-6 left-6 right-6 z-10 max-w-sm">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                <input
                  value={addressSearch}
                  onChange={(e) => {
                    setAddressSearch(e.target.value);
                    searchAddress(e.target.value);
                  }}
                  className="w-full pl-11 pr-12 py-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm shadow-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Hledat adresu..."
                />
                {searching && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                )}
              </div>

              {suggestions.length > 0 && (
                <div className="mt-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-1.5 space-y-0.5 animate-in slide-in-from-top-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectSuggestion(s)}
                      className="w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      <MapPin className="w-4 h-4 shrink-0 opacity-40" />
                      <p className="text-sm font-semibold truncate">{s.display_name}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full h-full">
              <Map center={center} zoom={13}>
                <MapControls />
                <MapClickHandler onLocationSelect={(la, lo) => { setLat(la); setLon(lo); }} />
                {lat && lon && (
                  <MapMarker 
                    latitude={lat} 
                    longitude={lon} 
                    draggable 
                    onDragStart={() => toast.info("Přetažením změňte polohu")}
                    onDragEnd={(e) => { 
                      setLat(e.lat); 
                      setLon(e.lng);
                      toast.success("Poloha aktualizována");
                    }}
                  >
                    <MarkerContent>
                      <div className="w-10 h-10 bg-primary rounded-full border-4 border-white shadow-xl flex items-center justify-center cursor-move transition-transform hover:scale-110">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                    </MarkerContent>
                  </MapMarker>
                )}
              </Map>
            </div>

            <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-80 space-y-3">
              <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-2xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Zvolená adresa</p>
                <div className="space-y-1 text-sm font-semibold text-zinc-900 dark:text-white">
                  <p>{addressData.city || "—"}</p>
                  <p className="opacity-60">{addressData.street ? `${addressData.street} ${addressData.houseNumber}` : "—"}</p>
                </div>
              </div>
              <div className="bg-primary/90 backdrop-blur-md text-white rounded-2xl p-4 shadow-xl text-[11px] font-medium leading-relaxed">
                Kliknutím do mapy nebo přetažením značky upřesníte polohu.
              </div>
            </div>
          </div>

          {/* Right: Form (30%) */}
          <div className="lg:flex-[5] flex flex-col min-h-0 bg-white dark:bg-zinc-950">
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <form id="place-form" onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Type className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Detaily místa</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Název místa</label>
                      <input
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Např. Klub Roxy"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Kategorie</label>
                      <input
                        name="type"
                        required
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Klub, Divadlo, Park..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Popis</label>
                      <textarea
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                        placeholder="Stručný popis místa..."
                      />
                    </div>
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Adresa</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Město</label>
                      <input
                        name="city"
                        required
                        value={addressData.city}
                        onChange={handleAddressChange}
                        className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">PSČ</label>
                      <input
                        name="zipCode"
                        required
                        value={addressData.zipCode}
                        onChange={handleAddressChange}
                        className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Ulice</label>
                      <input
                        name="street"
                        value={addressData.street}
                        onChange={handleAddressChange}
                        className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Číslo</label>
                      <input
                        name="houseNumber"
                        required
                        value={addressData.houseNumber}
                        onChange={handleAddressChange}
                        className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Links */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Ostatní</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Web</label>
                      <input
                        name="webUrl"
                        type="url"
                        value={formData.webUrl}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Další info</label>
                      <input
                        name="other"
                        value={formData.other}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Parkování, bezbariérovost..."
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Buttons */}
            <div className="p-8 mt-auto border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-white dark:bg-zinc-950">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 px-6 rounded-2xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Zavřít
              </button>
              <button
                form="place-form"
                type="submit"
                disabled={loading}
                className="flex-[2] py-4 px-6 rounded-2xl text-sm font-bold text-white bg-primary hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                {loading ? "Ukládám..." : existingPlace ? "Uložit změny" : "Vytvořit místo"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
