/**
 * PlaceTypeIcon — renders a lucide-react icon for a given cultural place type.
 * Used in map popups and place panels.
 */
import {
  Drama,
  Frame,
  Landmark,
  Music2,
  Clapperboard,
  Trophy,
  PartyPopper,
  BookOpen,
  GraduationCap,
  Leaf,
  UtensilsCrossed,
  Coffee,
  Mic2,
  Library,
  MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PlaceTypeIconProps {
  type: string;
  className?: string;
}

const TYPE_MAP: { keywords: string[]; icon: LucideIcon; color: string; bg: string }[] = [
  { keywords: ["divadlo", "theatre"], icon: Drama,           color: "text-purple-500", bg: "bg-purple-500/10" },
  { keywords: ["výstava", "galerie", "gallery"], icon: Frame, color: "text-blue-500", bg: "bg-blue-500/10" },
  { keywords: ["muzeum", "museum"],  icon: Landmark,          color: "text-amber-600", bg: "bg-amber-600/10" },
  { keywords: ["koncert", "music"],  icon: Music2,            color: "text-pink-500", bg: "bg-pink-500/10" },
  { keywords: ["kino", "film"],      icon: Clapperboard,      color: "text-red-500", bg: "bg-red-500/10" },
  { keywords: ["sport"],             icon: Trophy,            color: "text-green-500", bg: "bg-green-500/10" },
  { keywords: ["festival"],          icon: PartyPopper,       color: "text-orange-500", bg: "bg-orange-500/10" },
  { keywords: ["knihovna"],          icon: BookOpen,          color: "text-teal-500", bg: "bg-teal-500/10" },
  { keywords: ["vzdělá", "school"],  icon: GraduationCap,     color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { keywords: ["příroda", "park"],   icon: Leaf,              color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { keywords: ["restaurace", "food"], icon: UtensilsCrossed,  color: "text-rose-500", bg: "bg-rose-500/10" },
  { keywords: ["café", "kavárna", "coffee"], icon: Coffee,    color: "text-yellow-600", bg: "bg-yellow-600/10" },
  { keywords: ["sál", "club"],       icon: Mic2,              color: "text-violet-500", bg: "bg-violet-500/10" },
  { keywords: ["knihov"],            icon: Library,           color: "text-cyan-500", bg: "bg-cyan-500/10" },
];

export function getTypeIconMeta(type: string): { icon: LucideIcon; color: string; bg: string } {
  const lower = (type ?? "").toLowerCase();
  for (const entry of TYPE_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return { icon: entry.icon, color: entry.color, bg: entry.bg };
    }
  }
  return { icon: MapPin, color: "text-muted-foreground", bg: "bg-muted/20" };
}

export default function PlaceTypeIcon({ type, className = "w-4 h-4" }: PlaceTypeIconProps) {
  const { icon: Icon, color } = getTypeIconMeta(type);
  return <Icon className={`${className} ${color} shrink-0`} aria-hidden="true" />;
}
