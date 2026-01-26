"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserEvents, deleteEvent } from "@/services/api";
import EventForm from "./EventForm";

interface CultureEvent {
  id: number;
  name: string;
  description: string;
  type: string;
  ownerId: number;
  startDate: string;
  endDate: string | null;
  culturePlaceId: number | null;
  organizer: string;
  category: string;
}

export default function UserEventsList() {
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<CultureEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CultureEvent | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const loadEvents = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await fetchUserEvents(user.id);
      if (response?.data) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadEvents();
    }
  }, [user?.id]);

  const handleDelete = async (eventId: number) => {
    try {
      await deleteEvent(eventId);
      setEvents(events.filter((e) => e.id !== eventId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      concert: "Koncert",
      theater: "Divadlo",
      exhibition: "Výstava",
      festival: "Festival",
      workshop: "Workshop",
      sport: "Sport",
      other: "Jiné",
    };
    return types[type] || type;
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      concert:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      theater: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      exhibition:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      festival:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      workshop:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      sport: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
      other: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    };
    return colors[type] || colors.other;
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Pro správu akcí se musíte přihlásit.
        </p>
      </div>
    );
  }

  if (showForm || editingEvent) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {editingEvent ? "Upravit akci" : "Vytvořit novou akci"}
        </h3>
        <EventForm
          event={
            editingEvent
              ? {
                  id: editingEvent.id,
                  name: editingEvent.name,
                  description: editingEvent.description,
                  type: editingEvent.type,
                  startDate: editingEvent.startDate.slice(0, 16),
                  endDate: editingEvent.endDate?.slice(0, 16) || "",
                  culturePlaceId: editingEvent.culturePlaceId,
                }
              : undefined
          }
          onSuccess={() => {
            setShowForm(false);
            setEditingEvent(null);
            loadEvents();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Moje akce
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Přidat akci
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <svg
            className="animate-spin w-8 h-8 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Zatím nemáte žádné akce
          </h4>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Vytvořte svou první kulturní akci a sdílejte ji s ostatními.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Vytvořit první akci
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event, index) => (
            <div
              key={`${event.id}-${event.name}-${index}`}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {event.name}
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(event.type)}`}
                    >
                      {getEventTypeLabel(event.type)}
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(event.startDate)}
                    </span>
                    {event.endDate && (
                      <span className="text-gray-400 dark:text-gray-500">
                        → {formatDate(event.endDate)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingEvent(event)}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                    title="Upravit"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  {deleteConfirm === event.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        title="Potvrdit smazání"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Zrušit"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(event.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Smazat"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
