"use client";



type Tab = "overview" | "events" | "favorites" | "history" | "settings";

export default function Tabs({
  activeTab,
  setActiveTab,
  logout,
}: {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  logout: () => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl">
      <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
        {(["overview","events","favorites","history","settings"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* nav buttons */}

      <div className="p-6">
        {activeTab === "overview" && <div>Přehled...</div>}

        

        {activeTab === "favorites" && <div>Oblíbené...</div>}

        {activeTab === "history" && <div>Historie...</div>}

        {activeTab === "settings" && (
          <button onClick={logout}>Odhlásit</button>
        )}
      </div>
    </div>
  );
}