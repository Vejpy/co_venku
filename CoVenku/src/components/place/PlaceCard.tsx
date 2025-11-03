// /src/components/Place/PlaceCard.tsx
import React from "react";
import Image from "next/image";

interface PlaceCardProps {
  imageUrl: string;
  name: string;
  visitors: number;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ imageUrl, name, visitors }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-84 hover:-translate-y-1 transform transition-all duration-200" style={{ width: '336px' }}>
      <div className="relative w-full h-54" style={{ height: '216px' }}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover pt-10"
          sizes="(max-width: 768px) 100vw, 330px"
          priority={false}
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-medium mb-1">{name}</h3>
        <p className="text-gray-500 text-sm">
          {visitors.toLocaleString()} visitors
        </p>
      </div>
    </div>
  );
};

export default PlaceCard;