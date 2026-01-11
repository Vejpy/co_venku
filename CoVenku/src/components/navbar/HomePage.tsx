import Link from "next/link";
import React from "react";

export default function HomePageLogo() {
  return (
    <div className="py-8 pl-8">
      <Link
        href="/"
        className="text-6xl font-extrabold text-black "
      >
        Cv
      </Link>
    </div>
  );
}