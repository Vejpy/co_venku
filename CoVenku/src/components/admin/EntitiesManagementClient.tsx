"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, X, Pencil, Trash2, ShieldCheck, MapPin, Calendar, Building } from "lucide-react";
import { useRouter } from "next/navigation";
import { approveOrganizationAction, deleteEvent, deleteCulturePlace } from "@/services/api";

import { CultureEvent, CulturePlace } from "@/types/api";
import { EditEventModal } from "@/components/events/EditEventModal";
import PlaceModal from "@/components/user/PlaceModal";

type Tab = "events" | "places" | "organizers";

interface PendingOrganizer {
  id: number;
  name: string;
  ico: string;
  email: string;
}

interface EntitiesManagementClientProps {
  events: CultureEvent[];
  places: CulturePlace[];
  pendingOrganizers: PendingOrganizer[];
}

export default function EntitiesManagementClient({
  events,
  places,
  pendingOrganizers,
}: EntitiesManagementClientProps) {
  const [tab, setTab] = useState<Tab>("events");

  const router = useRouter();

  const handleApprove = async (id: number, name: string) => {
    try {
      await approveOrganizationAction(id, "verified");
      toast.success(`Organizace ${name} byla schválena.`);
      router.refresh();
    } catch {
      toast.error(`Chyba při schvalování organizace ${name}.`);
    }
  };

  const handleReject = async (id: number, name: string) => {
    try {
      await approveOrganizationAction(id, "rejected");
      toast.success(`Odstraněna žádost o schválení organizace ${name}.`);
      router.refresh();
    } catch {
      toast.error(`Chyba při zamítání organizace ${name}.`);
    }
  };

  const [editingEvent, setEditingEvent] = useState<CultureEvent | null>(null);
  const [editingPlace, setEditingPlace] = useState<CulturePlace | null>(null);

  const handleDelete = async (id: number, type: "event" | "place", orgId?: number) => {
    if (!confirm(`Opravdu chcete smazat ${type === "event" ? "událost" : "místo"} s ID ${id}?`)) return;
    try {
      if (type === "event") {
        await deleteEvent(id);
      } else {
        await deleteCulturePlace(id, orgId ?? 0);
      }
      toast.success(`${type === "event" ? "Událost" : "Místo"} s ID ${id} úspěšně smazána.`);
      router.refresh();
    } catch (e: unknown) {
      toast.error((e as { response?: { data?: { message?: string } } }).response?.data?.message || `Nepodařilo se smazat ${type}.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setTab("events")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === "events"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-white text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Správa událostí ({events.length})
        </button>
        <button
          onClick={() => setTab("places")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === "places"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-white text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          }`}
        >
          <MapPin className="w-4 h-4" />
          Kulturní místa ({places.length})
        </button>
        <button
          onClick={() => setTab("organizers")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === "organizers"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-white text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          }`}
        >
          <Building className="w-4 h-4" />
          Schvalování organizátorů
          {pendingOrganizers.length > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {pendingOrganizers.length}
            </span>
          )}
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        {tab === "events" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Název</th>
                  <th className="px-6 py-4 font-medium">Kategorie</th>
                  <th className="px-6 py-4 font-medium">Datum</th>
                  <th className="px-6 py-4 font-medium text-right">Akce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {events.slice(0, 10).map((event) => (
                  <tr key={event.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{event.name}</td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{event.type || "Neznámá"}</td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                      {event.validFrom ? new Date(event.validFrom).toLocaleDateString("cs-CZ") : "Neurčeno"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditingEvent(event)} className="p-1.5 text-zinc-400 hover:text-primary transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(event.id, "event")}
                          className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                      Žádné události nenalezeny.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "places" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Název místa</th>
                  <th className="px-6 py-4 font-medium">Typ</th>
                  <th className="px-6 py-4 font-medium text-right">Akce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {places.slice(0, 10).map((place) => (
                  <tr key={place.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{place.name}</td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{place.type}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditingPlace(place)} className="p-1.5 text-zinc-400 hover:text-primary transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(place.id, "place", place.organizationId ?? undefined)}
                          className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "organizers" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Název organizace</th>
                  <th className="px-6 py-4 font-medium">IČO</th>
                  <th className="px-6 py-4 font-medium">E-mail</th>
                  <th className="px-6 py-4 font-medium text-right">Akce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {pendingOrganizers.map((org) => (
                  <tr key={org.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{org.name}</td>
                    <td className="px-6 py-4 font-mono text-zinc-500">{org.ico}</td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{org.email}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleReject(org.id, org.name)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-md transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          Zamítnout
                        </button>
                        <button 
                          onClick={() => handleApprove(org.id, org.name)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 dark:text-green-400 dark:bg-green-900/20 dark:hover:bg-green-900/40 rounded-md transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Schválit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingOrganizers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                      <ShieldCheck className="w-8 h-8 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
                      Žádné čekající žádosti o schválení organizace.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSaved={() => {
            setEditingEvent(null);
            router.refresh();
          }}
          places={places}
        />
      )}

      {editingPlace && (
        <PlaceModal
          organizationId={editingPlace.organizationId!}
          existingPlace={editingPlace}
          onClose={() => setEditingPlace(null)}
          onSuccess={() => {
            setEditingPlace(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
