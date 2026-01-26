"use client";

import React from "react";

interface ScrollButtonProps {
  targetId: string;
  children: React.ReactNode;
}

export default function ScrollButton({
  targetId,
  children,
}: ScrollButtonProps) {
  const handleClick = () => {
    const target = document.getElementById(targetId);
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
    >
      {children}
    </button>
  );
}
