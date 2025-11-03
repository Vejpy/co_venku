import React, { useEffect } from "react";
import PlaceCardNav from "./PlaceCardNav";

interface Place {
  id: number;
  imageUrl: string;
  name: string;
  visitors: number;
  description: string;
}

interface PlacesNavProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const PlacesNav: React.FC<PlacesNavProps> = ({ place, isOpen, onClose, onOpen }) => {
  useEffect(() => {
    if (place) {
      onOpen();
    }
  }, [place, onOpen]);

  return (
    <nav
      className={`fixed inset-0 z-50 bg-white shadow-lg flex flex-col transform transition-transform h-full max-h-screen overflow-y-auto duration-300 ease-in-out md:relative md:inset-auto md:w-72 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="border-b border-gray-200 p-4 flex items-center bg-white z-10 mt-20 md:mt-16">
        <button
          onClick={onClose}
          aria-label="Close navigation"
          className="mr-4 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded text-2xl"
        >
          {"<"}
        </button>
        <h1 className="text-xl font-bold w-full text-center">Place Details</h1>
      </div>
      <div className="flex-1 flex justify-center items-center p-6 md:p-4 overflow-y-auto">
        <div className="max-h-[80vh] overflow-auto">
          {place ? (
            <PlaceCardNav
              imageUrl={place.imageUrl}
              name={place.name}
              visitors={place.visitors}
              description={place.description}
            />
          ) : (
            <p className="text-gray-500">No place selected.</p>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PlacesNav;
