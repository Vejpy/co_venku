import React from "react";
import Image from "next/image";

interface PlaceCardProps {
  imageUrl: string;
  name: string;
  visitors?: number;
  description?: string;
  className?: string;
  disableHover?: boolean;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  imageUrl,
  name,
  visitors,
  description,
  className,
  disableHover,
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden w-84 transform transition-all duration-200 border border-gray-200 dark:border-gray-700 ${!disableHover ? "hover:-translate-y-1 hover:shadow-lg" : ""} ${className || ""}`}
      style={{ width: "336px" }}
    >
      <div className="relative w-full h-54" style={{ height: "216px" }}>
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
        <h3 className="text-lg font-medium mb-1 text-gray-900 dark:text-white">
          {name}
        </h3>
        {visitors !== undefined && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {visitors.toLocaleString()} návštěvníků
          </p>
        )}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PlaceCard;
