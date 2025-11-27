// src/components/Place/PlaceCardNav.tsx
import React from "react";
import Image from "next/image";

interface PlaceCardNavProps {
  imageUrl: string;
  name: string;
  visitors: number;
  description: string;
}

const PlaceCardNav: React.FC<PlaceCardNavProps> = ({ imageUrl, name, description }) => {
  return (
    <div className="flex flex-col w-64 bg-white rounded-lg p-5 mt-10 shadow-md overflow-hidden">
      <div className="relative w-full h-48 pt-20">
        <Image src={imageUrl} alt={name} layout="fill" objectFit="cover" />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{name}</h2>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        {/* <p className="text-sm font-medium text-gray-800">Visitors: {visitors.toLocaleString()}</p> */}
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="w-full h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">
          Graph placeholder
        </div>
      </div>
    </div>
  );
};

export default PlaceCardNav;
