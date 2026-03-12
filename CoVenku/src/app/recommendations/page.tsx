import React from "react";
import { cookies } from "next/headers";
import { EventList } from "@/components/events/EventList";

async function getRecommendations() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return null; // Not authenticated
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7246";
  try {
    const res = await fetch(`${baseUrl}/api/Recommendations/FromAI`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 }, // Do not cache, personalized
    });

    if (!res.ok) {
      console.error("AI Recommendations fetch failed:", res.statusText);
      return [];
    }

    const result = await res.json();
    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error("AI Recommendations fetch error:", error);
    return [];
  }
}

export default async function RecommendationsPage() {
  const recommendations = await getRecommendations();

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 mb-8 text-white shadow-sm">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI Doporučení
        </h1>
        <p className="text-indigo-100 max-w-2xl">
          Na základě vašich dřívějších účastí jsme pro vás našli ty nejrelevantnější budoucí akce.
        </p>
      </div>

      {recommendations === null ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center text-zinc-600 dark:text-zinc-400">
          Pro zobrazení personalizovaných doporučení se prosím přihlaste.
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center text-zinc-600 dark:text-zinc-400">
          Zatím nemáme dostatek dat o vaší historii pro doporučení nových akcí. Začněte se účastnit akcí!
        </div>
      ) : (
        <EventList 
          events={recommendations} 
          emptyMessage="Aktuálně pro vás nemáme žádné další doporučení." 
        />
      )}
    </div>
  );
}
