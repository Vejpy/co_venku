"use client";

import React, { JSX } from "react";

interface CustomSVGMarkerProps {
  type: "culture" | "concert" | "sport" | "food";
  selected?: boolean;
  number?: number;
  size?: number;
}

const typeColors: Record<string, string> = {
  culture: "#B19CD9",
  concert: "#B19CD9",
  sport: "#B19CD9",
  food: "#B19CD9",
};

const typeShapes: Record<string, JSX.Element> = {
  culture: <rect x="8" y="8" width="16" height="16" fill="white" />,
  concert: <polygon points="14,6 24,26 4,26" fill="white" />,
  sport: <circle cx="16" cy="16" r="8" fill="white" />,
  food: <path d="M16 6 L26 26 L6 26 Z" fill="white" />,
};

export const CustomSVGMarker: React.FC<CustomSVGMarkerProps> = ({
  type,
  selected = false,
  number,
  size = 32,
}) => {
  const color = typeColors[type] || "#B19CD9";
  const strokeColor = selected ? "#B19CD9" : "#B19CD9";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: "pointer", transition: "transform 0.2s" }}
      className="hover:scale-110"
    >
      <circle
        cx="16"
        cy="16"
        r="14"
        fill={color}
        stroke={strokeColor}
        strokeWidth="2"
      />
      {typeShapes[type]}

      {number !== undefined && (
        <text
          x="16"
          y="20"
          textAnchor="middle"
          fill="black"
          fontSize="10"
          fontWeight="bold"
        >
          {number}
        </text>
      )}
    </svg>
  );
};

export default CustomSVGMarker;
