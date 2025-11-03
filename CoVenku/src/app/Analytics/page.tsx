"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import PlaceCard from "@/components/place/PlaceCard";
import { Place } from "@/types/place";
import testPlaces from "@/data/placesData";
import PlacesNav from "@/components/place/PlacesNav";

export default function PlacesPage() {
  const places: Place[] = testPlaces; // Type-safe
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [pendingPlace, setPendingPlace] = useState<Place | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNavClose = useCallback(() => {
    if (!isNavOpen) return;
    setIsNavOpen(false);
    // Delay clearing selectedPlace until after animation
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSelectedPlace(null);
      setPendingPlace(null);
    }, 500);
  }, [isNavOpen]);

  const handleNavOpen = useCallback(() => {
    setIsNavOpen(true);
  }, []);

  // Handle clicking outside the sidebar/modal to close it
  useEffect(() => {
    if (!isNavOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        handleNavClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNavOpen, handleNavClose]);

  const handleCardClick = (place: Place) => {
    if (selectedPlace && selectedPlace.id === place.id) {
      // If clicking the same place, do nothing
      return;
    }
    if (isNavOpen) {
      // Replace content immediately without hiding sidebar
      setSelectedPlace(place);
      setPendingPlace(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      // Open sidebar first
      setIsNavOpen(true);
      setSelectedPlace(place);
      setPendingPlace(null);
    }
  };

  // Effect to handle updating selectedPlace after closing animation when switching places while sidebar is closed
  useEffect(() => {
    if (!isNavOpen && pendingPlace) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setSelectedPlace(pendingPlace);
        setPendingPlace(null);
      }, 500);
    }
  }, [isNavOpen, pendingPlace]);

  return (
    <div className="relative h-full min-h-full flex justify-center pt-20 px-6">
      {/* Main content area */}
      <div className="flex flex-wrap gap-6 justify-center max-w-7xl w-full">
        {places.map((place) => (
          <div
            key={place.id}
            className="cursor-pointer"
            onClick={() => {
              if (isNavOpen) {
                handleCardClick(place);
              } else {
                if (selectedPlace && selectedPlace.id !== place.id) {
                  setPendingPlace(place);
                  setIsNavOpen(false); // Close sidebar first to trigger animation
                } else {
                  handleCardClick(place);
                }
              }
            }}
          >
            <PlaceCard
              imageUrl={place.imageUrl}
              name={place.name}
              visitors={place.visitors}
            />
          </div>
        ))}
      </div>

      {/* Sidebar / Modal */}
      <div
        ref={sidebarRef}
        className={`
          fixed top-0 bottom-0 right-0 z-40 bg-white 
          w-full md:w-1/3 lg:w-1/4
          transition-transform duration-500 ease-in-out
          ${
            !isNavOpen
              ? "translate-x-full"
              : "translate-x-0"
          }
          md:flex md:flex-col
        `}
        style={{ willChange: "transform" }}
      >
        {/* Always render PlacesNav to allow slide-out animation */}
        <PlacesNav place={selectedPlace} isOpen={isNavOpen} onClose={handleNavClose} onOpen={handleNavOpen} />
      </div>
    </div>
  );
}