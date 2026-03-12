import React, { useState, useCallback, useMemo, useEffect } from "react";
import { createEvent } from "@/services/api";
import { toast } from "sonner";
import type { CulturePlace } from "@/types/api";
import { 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  Type, 
  FileText, 
  Clock, 
  CheckCircle2,
  Map as MapIcon,
  Search,
  X
} from "lucide-react";
import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls } from "@/components/ui/map";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { cn } from "@/lib/utils";

interface EventFormData {
  name: string;
  description: string;
  validFrom: string;
  validTo: string;
  isLongTerm: boolean;
  url: string;
  culturePlaceId: number;
  organizationId: number | null;
  type: string;
}

interface CreateEventFormProps {
  places: CulturePlace[];
  organizations: import("@/types/api").Organization[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EVENT_TYPES = [
  "Festival", "Koncert", "Divadlo", "Kino", "Výstava", "Přednáška", "Workshop", "Sport", "Jiné"
];

export function CreateEventForm({ places, organizations, onSuccess, onCancel }: CreateEventFormProps) {
  const [loading, setLoading] = useState(false);
  
  // Default dates: Start = next hour, End = start + 2 hours
  // Format for datetime-local input: YYYY-MM-DDTHH:mm
  const getDefaultDates = () => {
    const start = new Date();
    start.setHours(start.getHours() + 1, 0, 0, 0);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    
    const formatLocal = (d: Date) => {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    return {
      from: formatLocal(start),
      to: formatLocal(end)
    };
  };

  const [isPersonal, setIsPersonal] = useState(true);

  const [formData, setFormData] = useState<EventFormData>(() => {
    const dates = getDefaultDates();
    return {
      name: "",
      description: "",
      validFrom: dates.from,
      validTo: dates.to,
      isLongTerm: false,
      url: "",
      culturePlaceId: 0,
      organizationId: null,
      type: "Jiné",
    };
  });

  useEffect(() => {
    if (!isPersonal && organizations?.length > 0 && !formData.organizationId) {
      const firstOrgId = Number(organizations[0].id);
      const firstPlaceForOrg = places?.find(p => Number(p.organizationId) === firstOrgId);
      
      setFormData(prev => ({
        ...prev,
        organizationId: firstOrgId,
        culturePlaceId: firstPlaceForOrg?.id || 0
      }));
    } else if (isPersonal) {
      setFormData(prev => ({
        ...prev,
        organizationId: null,
        culturePlaceId: 0
      }));
    }
  }, [organizations, places, isPersonal, formData.organizationId]);

  const [searchPlace, setSearchPlace] = useState("");
  
  const availablePlaces = useMemo(() => {
    if (!places) return [];
    if (isPersonal) {
        return places.filter(p => !p.organizationId);
    }
    if (!formData.organizationId) return [];
    return places.filter(p => Number(p.organizationId) === Number(formData.organizationId));
  }, [places, formData.organizationId, isPersonal]);

  const filteredPlaces = useMemo(() => {
    if (!searchPlace || !availablePlaces) return availablePlaces || [];
    const search = searchPlace.toLowerCase();
    return availablePlaces.filter(p => 
      p.name?.toLowerCase().includes(search) ||
      p.address?.city?.toLowerCase().includes(search) ||
      p.address?.street?.toLowerCase().includes(search)
    );
  }, [availablePlaces, searchPlace]);

  const selectedPlace = useMemo(() => 
    places?.find(p => p.id === Number(formData.culturePlaceId)), 
  [places, formData.culturePlaceId]);

  const mapCenter = useMemo(() => 
    selectedPlace ? [selectedPlace.lon, selectedPlace.lat] as [number, number] : [14.4378, 50.0755] as [number, number],
  [selectedPlace]);

  const handleFormDateChange = (name: string, val: string) => {
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    // IDs should ALWAYS be numbers
    const isIdField = name === "culturePlaceId" || name === "organizationId";
    const numVal = Number(val);

    if (name === "culturePlaceId" && numVal !== 0) {
      const place = places?.find(p => p.id === numVal);
      if (place && place.organizationId) {
        setFormData(prev => ({ 
          ...prev, 
          culturePlaceId: numVal, 
          organizationId: Number(place.organizationId) 
        }));
        return;
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: isIdField ? numVal : val,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.culturePlaceId) {
      toast.error("Vyberte prosím místo konání.");
      return;
    }
    if (!formData.validFrom) {
      toast.error("Zadejte prosím začátek akce.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        validFrom: new Date(formData.validFrom).toISOString(),
        validTo: formData.validTo ? new Date(formData.validTo).toISOString() : null,
        timeSlots: [
          { 
            start: new Date(formData.validFrom).toISOString(), 
            end: formData.validTo ? new Date(formData.validTo).toISOString() : null
          }
        ],
        organizationId: isPersonal ? null : formData.organizationId,
      };

      await createEvent(payload);
      toast.success("Událost byla úspěšně vytvořena.");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Nastala chyba při vytváření události.");
    } finally {
      setLoading(false);
    }
  };

  const markers = useMemo(() => 
    filteredPlaces.map(p => ({
      id: p.id,
      position: [p.lon, p.lat] as [number, number],
      title: p.name || "",
      type: p.type || "",
    })),
  [filteredPlaces]);

  const handleMarkerClick = (placeId: number) => {
    const place = places?.find(p => p.id === placeId);
    if (place) {
      setFormData(prev => ({
        ...prev,
        culturePlaceId: place.id,
        organizationId: place.organizationId && !isPersonal ? Number(place.organizationId) : prev.organizationId
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-md p-4 lg:p-8 animate-in fade-in duration-300">
      <div className="w-full max-w-6xl h-full max-h-[90vh] bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <Type className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Nová událost</h2>
              <p className="text-xs text-zinc-500 font-medium">Vytvořte novou akci ve vašem místě</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Left Side: Map */}
          <div className="w-full lg:w-[70%] h-[300px] lg:h-auto relative border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {/* Search Overlay */}
            <div className="absolute top-6 left-6 z-10 w-full max-w-xs">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Hledat místo konání..."
                  value={searchPlace}
                  onChange={(e) => setSearchPlace(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-lg"
                />
              </div>

              {searchPlace && (
                <div className="mt-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-1.5 space-y-0.5 animate-in slide-in-from-top-2">
                  {filteredPlaces.length === 0 ? (
                    <p className="p-4 text-sm text-zinc-500 text-center">Žádná místa nenalezena</p>
                  ) : (
                    filteredPlaces.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, culturePlaceId: p.id }));
                          setSearchPlace("");
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3",
                          formData.culturePlaceId === p.id 
                            ? "bg-primary/10 text-primary" 
                            : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                        )}
                      >
                        <MapPin className="w-4 h-4 shrink-0 opacity-40" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{p.name}</p>
                          <p className="text-xs opacity-60 truncate">{p.address?.city}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="w-full h-full">
              <Map center={mapCenter} zoom={13}>
                <MapControls />
                {markers.map(m => (
                  <MapMarker 
                    key={m.id} 
                    longitude={m.position[0]}
                    latitude={m.position[1]}
                    onClick={() => setFormData(p => ({ ...p, culturePlaceId: m.id }))}
                  >
                    <MarkerContent>
                      <div className={cn(
                        "w-8 h-8 rounded-full border-2 border-white flex items-center justify-center transition-all shadow-md bg-zinc-500",
                        formData.culturePlaceId === m.id && "bg-primary scale-110"
                      )}>
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                    </MarkerContent>
                    <MarkerPopup>
                      <div className="p-2 min-w-[150px]">
                        <p className="text-sm font-bold text-zinc-900 dark:text-white mb-1">{m.title}</p>
                        <button 
                          className="mt-2 w-full py-1.5 bg-primary rounded-lg text-white text-[10px] font-bold uppercase tracking-wider"
                          onClick={() => setFormData(p => ({ ...p, culturePlaceId: m.id }))}
                        >
                          Vybrat toto místo
                        </button>
                      </div>
                    </MarkerPopup>
                  </MapMarker>
                ))}
              </Map>
            </div>

            {selectedPlace && (
              <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-80">
                <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">Vybrané místo</p>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">{selectedPlace.name}</h4>
                    <p className="text-xs text-zinc-500 truncate">{selectedPlace.address?.city}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Form (30%) */}
          <div className="lg:flex-[5] flex flex-col min-h-0 bg-white dark:bg-zinc-950">
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <form id="create-event-form" onSubmit={handleSubmit} className="space-y-8">
                {/* Context Switcher & Organization Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Kdo událost pořádá?</h3>
                  </div>

                  {/* Switcher */}
                  <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl w-full max-w-sm">
                    <button
                        type="button"
                        onClick={() => setIsPersonal(true)}
                        className={cn(
                            "flex-1 py-2 text-sm font-semibold rounded-xl transition-all",
                            isPersonal 
                            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" 
                            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        )}
                    >
                        Osobní profil
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsPersonal(false)}
                        className={cn(
                            "flex-1 py-2 text-sm font-semibold rounded-xl transition-all",
                            !isPersonal 
                            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" 
                            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        )}
                    >
                        Moje organizace
                    </button>
                  </div>

                  {!isPersonal && (
                      <div className="space-y-1.5 pt-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Vyberte organizaci</label>
                        <select
                        name="organizationId"
                        value={formData.organizationId || 0}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                        >
                        <option value={0} disabled>Vyberte organizaci...</option>
                        {organizations.map(org => (
                            <option key={org.id} value={org.id}>{org.name}</option>
                        ))}
                        </select>
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Type className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Detaily</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Název akce</label>
                      <input
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Např. Letní kino na hradě"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Popis</label>
                      <textarea
                        name="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                        placeholder="Popište vaší akci..."
                      />
                    </div>
                  </div>
                </div>

                {/* Time & Category */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Čas a Typ</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Začátek</label>
                      <DateTimePicker
                        value={formData.validFrom}
                        onChange={(val) => handleFormDateChange("validFrom", val)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Konec</label>
                      <DateTimePicker
                        value={formData.validTo}
                        onChange={(val) => handleFormDateChange("validTo", val)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Typ události</label>
                    <div className="grid grid-cols-3 gap-2">
                      {EVENT_TYPES.map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, type }))}
                          className={cn(
                            "py-2.5 rounded-xl text-xs font-medium border transition-all",
                            formData.type === type 
                              ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                              : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <LinkIcon className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Odkazy</h3>
                  </div>
                  <div className="relative group">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <input
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="https://vaseakce.cz"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Buttons */}
            <div className="p-8 mt-auto border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-white dark:bg-zinc-950">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-4 px-6 rounded-2xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Zrušit
              </button>
              <button
                form="create-event-form"
                type="submit"
                disabled={loading}
                className="flex-[2] py-4 px-6 rounded-2xl text-sm font-bold text-white bg-primary hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                {loading ? "Vytvářím..." : "Vytvořit událost"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
