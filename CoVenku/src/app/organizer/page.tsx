import React from "react";
import { OrganizerDashboard } from "@/components/organizer/OrganizerDashboard";

export const metadata = {
  title: "Panel Organizátora | CoVenku",
  description: "Analytika a správa pro organizátory kulturních akcí.",
};

export default function OrganizerPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <OrganizerDashboard />
    </div>
  );
}
