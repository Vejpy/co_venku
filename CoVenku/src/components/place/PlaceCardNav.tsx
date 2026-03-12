import React from "react";
import Image from "next/image";

interface PlaceCardNavProps {
  imageUrl?: string | null;
  name: string;
  visitors: number;
  description: string;
}

const PlaceCardNav: React.FC<PlaceCardNavProps> = ({
  imageUrl,
  name,
  description,
}) => {
  return (
    <div className="flex flex-col w-64 bg-white dark:bg-zinc-800 rounded-lg p-5 mt-10 shadow-md overflow-hidden border border-zinc-200 dark:border-zinc-700">
      <div className="relative w-full h-48 pt-20">
        {imageUrl && imageUrl.trim() !== "" ? (
          <Image src={imageUrl} alt={name} layout="fill" objectFit="cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400">
            Bez obrázku
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
          {name}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
          {description}
        </p>
      </div>
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
        <div className="w-full h-24 bg-zinc-100 dark:bg-zinc-700 rounded-md flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-sm">
          Graf
        </div>
      </div>
    </div>
  );
};

export default PlaceCardNav;
