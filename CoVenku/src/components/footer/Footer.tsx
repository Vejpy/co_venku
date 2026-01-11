import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12 text-center text-gray-500 dark:text-gray-400">
      © {new Date().getFullYear()} CoVenku. All rights reserved.
    </footer>
  );
}
