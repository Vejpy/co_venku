"use client";

import type { CulturePlace } from "@/types/map";
import PlaceTypeIcon, { getTypeIconMeta } from "@/components/map/PlaceTypeIcon";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MapPin, Globe } from "lucide-react";

interface PlaceCardProps {
  place: CulturePlace;
  isSelected?: boolean;
  onClick?: () => void;
}

export function PlaceCard({ place, isSelected, onClick }: PlaceCardProps) {
  const { color, bg } = getTypeIconMeta(place.type ?? "");

  const address = [place.address?.city, place.address?.street].filter(Boolean).join(", ");

  return (
    <Link
      href={`/places/${place.id}`}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "flex gap-3 px-3 py-2.5 rounded-xl border transition-all cursor-pointer",
        isSelected
          ? "border-primary/50 bg-primary/5"
          : "border-border bg-card hover:border-primary/20 hover:bg-muted/40",
      )}
    >
      {/* Icon badge */}
      <div
        className={cn(
          "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5",
          bg, color
        )}
      >
        <PlaceTypeIcon type={place.type ?? ""} className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{place.name}</p>

        <span
          className={cn(
            "inline-block text-[10px] px-1.5 py-0.5 rounded-full mt-0.5 font-medium",
            bg, color
          )}
        >
          {place.type}
        </span>

        {address && (
          <p className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
            <MapPin className="w-2.5 h-2.5 shrink-0" />
            <span className="truncate">{address}</span>
          </p>
        )}

        {place.website && (
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 mt-1 text-[10px] text-primary hover:underline"
          >
            <Globe className="w-2.5 h-2.5" />
            Web
          </a>
        )}
      </div>
    </Link>
  );
}

export default PlaceCard;
