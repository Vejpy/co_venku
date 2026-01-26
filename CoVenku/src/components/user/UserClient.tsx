"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Tabs from "./Tabs";
import ProfileHeader from "./ProfileHeader";

export default function UserClient() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "overview" | "events" | "favorites" | "history" | "settings"
  >("overview");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (
      tab &&
      ["overview", "events", "favorites", "history", "settings"].includes(tab)
    ) {
      setActiveTab(tab as typeof activeTab);
    }
  }, [searchParams]);

  if (isLoading) return <div className="pt-20 text-center">Načítání...</div>;

  if (!isAuthenticated) return <div className="pt-20 text-center">Přihlaste se</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProfileHeader user={user} />
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          logout={logout}
        />
      </div>
    </div>
  );
}