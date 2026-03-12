"use client";

import React, { useState, useMemo } from "react";
import type { CultureEvent, CulturePlace } from "@/types/api";
import { updateEvent } from "@/services/api";
import { toast } from "sonner";
import { 
  X, 
  Type, 
  Calendar, 
  Clock, 
  Link as LinkIcon, 
  CheckCircle2, 
  Map as MapIcon,
  MapPin,
  Search
} from "lucide-react";
import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls } from "@/components/ui/map";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { cn } from "@/lib/utils";

interface EditEventModalProps {
  event: CultureEvent;
  onClose: () => void;
  onSaved: () => void;
  places: CulturePlace[];
}

const EVENT_TYPES = [
  "Festival", "Koncert", "Divadlo", "Kino", "Výstava", "Přednáška", "Workshop", "Sport", "Jiné"
];

export function EditEventModal({
  event,
  onClose,
  onSaved,
  places,
}: EditEventModalProps) {
  const [formData, setFormData] = useState({
    name: event.name ?? "",
    description: event.description ?? "",
    type: event.type ?? "Jiné",
    validFrom: event.validFrom ? event.validFrom : "",
    validTo: event.validTo ? event.validTo : "",
    url: event.url ?? "",
    culturePlaceId: event.culturePlaceId ?? 0,
    isLongTerm: event.isLongTerm ?? false,
  });

  const [searchPlace, setSearchPlace] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredPlaces = useMemo(() => {
    if (!searchPlace) return places;
    const search = searchPlace.toLowerCase();
    return places.filter(p => 
      p.name?.toLowerCase().includes(search) ||
      p.address?.city?.toLowerCase().includes(search) ||
      p.address?.street?.toLowerCase().includes(search)
    );
  }, [places, searchPlace]);

  const selectedPlace = useMemo(() => 
    places.find(p => p.id === formData.culturePlaceId), 
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
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === "culturePlaceId" ? Number(val) : val,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.culturePlaceId) {
      toast.error("Vyberte prosím místo konání.");
      return;
    }
    if (!formData.validFrom) {
      toast.error("Zadejte prosím začátek akce.");
      return;
    }

    setSaving(true);
    try {
      await updateEvent(event.id, {
        name: formData.name,
        description: formData.description,
        startDate: new Date(formData.validFrom).toISOString(),
        endDate: formData.validTo ? new Date(formData.validTo).toISOString() : null,
        culturePlaceId: formData.culturePlaceId,
        type: formData.type,
        organizationId: event.organizationId,
      });
      toast.success("Událost byla úspěšně aktualizována.");
      onSaved();
    } catch {
      toast.error("Nepodařilo se aktualizovat událost.");
    } finally {
      setSaving(false);
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
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Upravit událost</h2>
              <p className="text-xs text-zinc-500 font-medium">Aktualizujte detaily vaší akce</p>
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
            {/* Search Overlay */}
            <div className="absolute top-6 left-6 right-6 z-10 max-w-sm">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                <input
                  value={searchPlace}
                  onChange={(e) => setSearchPlace(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm shadow-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Hledat místo konání..."
                />
              </div>

              {searchPlace && (
                <div className="mt-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-1.5 space-y-0.5 animate-in slide-in-from-top-2">
                  {filteredPlaces.map(p => (
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
                  ))}
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
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">Místo konání</p>
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
              <form id="edit-form" onSubmit={handleSave} className="space-y-8">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Type className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Detaily</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Název</label>
                      <input
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                      />
                    </div>
                  </div>
                </div>

                {/* Time & Category */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Čas</h3>
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
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Typ</label>
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
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Web</h3>
                  </div>
                  <div className="relative group">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <input
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Buttons */}
            <div className="p-8 mt-auto border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 px-6 rounded-2xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Zavřít
              </button>
              <button
                form="edit-form"
                type="submit"
                disabled={saving}
                className="flex-[2] py-4 px-6 rounded-2xl text-sm font-bold text-white bg-primary hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                {saving ? "Ukládám..." : "Uložit změny"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
