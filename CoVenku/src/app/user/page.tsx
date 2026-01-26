// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { useAuth } from "@/context/AuthContext";
// import UserEventsList from "@/components/events/UserEventsList";

// // Mock favorite places
// interface FavoritePlace {
//   id: number;
//   name: string;
//   type: string;
//   city: string;
//   visitedAt: string;
// }

// export default function UserPage() {
//   const searchParams = useSearchParams();
//   const { user, isAuthenticated, isLoading, logout } = useAuth();
//   const [activeTab, setActiveTab] = useState<
//     "overview" | "events" | "favorites" | "history" | "settings"
//   >("overview");

//   // Set active tab from URL params
//   useEffect(() => {
//     const tab = searchParams.get("tab");
//     if (
//       tab &&
//       ["overview", "events", "favorites", "history", "settings"].includes(tab)
//     ) {
//       setActiveTab(tab as typeof activeTab);
//     }
//   }, [searchParams]);

//   const favoritePlaces: FavoritePlace[] = [
//     {
//       id: 1,
//       name: "Národní divadlo",
//       type: "Divadlo",
//       city: "Praha",
//       visitedAt: "2024-03-15",
//     },
//     {
//       id: 2,
//       name: "Rudolfinum",
//       type: "Koncertní síň",
//       city: "Praha",
//       visitedAt: "2024-02-20",
//     },
//     {
//       id: 3,
//       name: "Bio Oko",
//       type: "Kino",
//       city: "Praha",
//       visitedAt: "2024-01-10",
//     },
//   ];

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
//         <div className="flex items-center gap-3">
//           <svg
//             className="animate-spin w-8 h-8 text-indigo-600"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             />
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//             />
//           </svg>
//           <span className="text-gray-600 dark:text-gray-400">Načítání...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
//         <div className="max-w-md mx-auto px-4 py-16">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
//             <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
//               <svg
//                 className="w-10 h-10 text-indigo-600 dark:text-indigo-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                 />
//               </svg>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//               Přihlaste se
//             </h1>
//             <p className="text-gray-500 dark:text-gray-400 mb-8">
//               Pro přístup k profilu se prosím přihlaste nebo zaregistrujte.
//             </p>
//             <div className="space-y-3">
//               <a
//                 href="/Login_Register"
//                 className="block w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
//               >
//                 Přihlásit se
//               </a>
//               <a
//                 href="/Login_Register"
//                 className="block w-full py-3 px-4 bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-gray-600 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-gray-600 transition-colors"
//               >
//                 Vytvořit účet
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 transition-colors">
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         {/* Profile Header */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center gap-6">
//             {/* Avatar */}
//             <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
//               {user?.name
//                 ?.split(" ")
//                 .map((n) => n[0])
//                 .join("") || "U"}
//             </div>

//             {/* User Info */}
//             <div className="flex-1">
//               <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//                 {user?.name || "Uživatel"}
//               </h1>
//               <p className="text-gray-500 dark:text-gray-400">
//                 {user?.role || "Uživatel"}
//               </p>
//               <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
//                 Členem od{" "}
//                 {user?.birth
//                   ? new Date(user.birth).toLocaleDateString("cs-CZ", {
//                       month: "long",
//                       year: "numeric",
//                     })
//                   : "nedávna"}
//               </p>
//             </div>

//             {/* Quick Stats */}
//             <div className="flex gap-6">
//               <div className="text-center">
//                 <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
//                   0
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">
//                   Vytvořených akcí
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
//                   0
//                 </div>
//                 <div className="text-sm text-gray-500 dark:text-gray-400">
//                   Účastí na akcích
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
//           <div className="border-b border-gray-200 dark:border-gray-700">
//             <nav className="flex overflow-x-auto">
//               {[
//                 {
//                   id: "overview",
//                   label: "Přehled",
//                   icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
//                 },
//                 {
//                   id: "events",
//                   label: "Moje akce",
//                   icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
//                 },
//                 {
//                   id: "favorites",
//                   label: "Oblíbená místa",
//                   icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
//                 },
//                 {
//                   id: "history",
//                   label: "Historie",
//                   icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
//                 },
//                 {
//                   id: "settings",
//                   label: "Nastavení",
//                   icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
//                 },
//               ].map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id as typeof activeTab)}
//                   className={cn(
//                     "flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
//                     activeTab === tab.id
//                       ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
//                       : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600",
//                   )}
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d={tab.icon}
//                     />
//                   </svg>
//                   {tab.label}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           {/* Tab Content */}
//           <div className="p-6">
//             {activeTab === "overview" && (
//               <div className="grid md:grid-cols-2 gap-6">
//                 {/* Recent Activity */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                     Poslední aktivita
//                   </h3>
//                   <div className="space-y-4">
//                     {[
//                       {
//                         action: "Navštívil/a",
//                         place: "Národní divadlo",
//                         date: "Před 2 dny",
//                       },
//                       {
//                         action: "Přidal/a do oblíbených",
//                         place: "Bio Oko",
//                         date: "Před týdnem",
//                       },
//                       {
//                         action: "Zúčastnil/a se akce",
//                         place: "Jazz Festival",
//                         date: "Před 2 týdny",
//                       },
//                     ].map((activity, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
//                       >
//                         <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
//                           <svg
//                             className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M9 5l7 7-7 7"
//                             />
//                           </svg>
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm text-gray-900 dark:text-white">
//                             {activity.action}{" "}
//                             <span className="font-medium">
//                               {activity.place}
//                             </span>
//                           </p>
//                           <p className="text-xs text-gray-500 dark:text-gray-400">
//                             {activity.date}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Recommendations */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                     Doporučená místa
//                   </h3>
//                   <div className="space-y-3">
//                     {[
//                       {
//                         name: "Městské divadlo Brno",
//                         type: "Divadlo",
//                         match: 95,
//                       },
//                       {
//                         name: "Palác Akropolis",
//                         type: "Koncertní síň",
//                         match: 88,
//                       },
//                       { name: "Kino Aero", type: "Kino", match: 82 },
//                     ].map((rec, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors cursor-pointer"
//                       >
//                         <div className="flex-1">
//                           <p className="font-medium text-gray-900 dark:text-white">
//                             {rec.name}
//                           </p>
//                           <p className="text-sm text-gray-500 dark:text-gray-400">
//                             {rec.type}
//                           </p>
//                         </div>
//                         <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
//                           {rec.match}% shoda
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "events" && <UserEventsList />}

//             {activeTab === "favorites" && (
//               <div>
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                     Oblíbená místa
//                   </h3>
//                   <span className="text-sm text-gray-500 dark:text-gray-400">
//                     {favoritePlaces.length} míst
//                   </span>
//                 </div>
//                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {favoritePlaces.map((place) => (
//                     <div
//                       key={place.id}
//                       className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-800"
//                     >
//                       <div className="flex items-start justify-between mb-2">
//                         <h4 className="font-medium text-gray-900 dark:text-white">
//                           {place.name}
//                         </h4>
//                         <button className="text-red-500 hover:text-red-600">
//                           <svg
//                             className="w-5 h-5"
//                             fill="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//                           </svg>
//                         </button>
//                       </div>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         {place.type} • {place.city}
//                       </p>
//                       <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
//                         Navštíveno{" "}
//                         {new Date(place.visitedAt).toLocaleDateString("cs-CZ")}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {activeTab === "history" && (
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                   Historie návštěv
//                 </h3>
//                 <div className="space-y-4">
//                   {[
//                     {
//                       date: "Březen 2024",
//                       places: ["Národní divadlo", "Rudolfinum"],
//                     },
//                     { date: "Únor 2024", places: ["Bio Oko", "Jazz Dock"] },
//                     { date: "Leden 2024", places: ["Městská knihovna", "DOX"] },
//                   ].map((month, i) => (
//                     <div key={i}>
//                       <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
//                         {month.date}
//                       </h4>
//                       <div className="space-y-2">
//                         {month.places.map((place, j) => (
//                           <div
//                             key={j}
//                             className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
//                           >
//                             <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
//                               <svg
//                                 className="w-4 h-4 text-indigo-600 dark:text-indigo-400"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                                 />
//                               </svg>
//                             </div>
//                             <span className="text-gray-900 dark:text-white">
//                               {place}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {activeTab === "settings" && (
//               <div className="max-w-xl">
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
//                   Nastavení účtu
//                 </h3>
//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Jméno
//                     </label>
//                     <input
//                       type="text"
//                       defaultValue={user?.name || ""}
//                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Role
//                     </label>
//                     <input
//                       type="text"
//                       defaultValue={user?.role || ""}
//                       disabled
//                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                       Notifikace
//                     </label>
//                     <div className="space-y-2">
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="checkbox"
//                           defaultChecked
//                           className="w-4 h-4 text-indigo-600 rounded"
//                         />
//                         <span className="text-sm text-gray-700 dark:text-gray-300">
//                           Emailové upozornění na nové akce
//                         </span>
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="checkbox"
//                           defaultChecked
//                           className="w-4 h-4 text-indigo-600 rounded"
//                         />
//                         <span className="text-sm text-gray-700 dark:text-gray-300">
//                           Týdenní přehled
//                         </span>
//                       </label>
//                     </div>
//                   </div>
//                   <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
//                     <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
//                       Uložit změny
//                     </button>
//                   </div>
//                   <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
//                     <button
//                       onClick={() => {
//                         logout();
//                         window.location.href = "/";
//                       }}
//                       className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
//                     >
//                       Odhlásit se
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Suspense } from "react";
import UserClient from "@/components/user/UserClient";

export default function UserPage() {
  return (
    <Suspense fallback={<div className="pt-20 text-center">Načítání profilu...</div>}>
      <UserClient />
    </Suspense>
  );
}