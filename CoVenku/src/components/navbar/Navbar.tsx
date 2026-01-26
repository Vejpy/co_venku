"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { navbarItems } from "../../utils/navbarData";
import ThemeToggle from "../ui/ThemeToggle";
import UserMenu from "../ui/UserMenu";
import { useAuth } from "@/context/AuthContext";

const LOGO_SCROLL_THRESHOLD = 100;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > LOGO_SCROLL_THRESHOLD) {
        setShowLogo(true);
      } else {
        setShowLogo(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto pl-2 pr-4 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8">
        <div className="flex items-center justify-between min-h-16">
          <div className="flex-shrink-0 justify-between">
            <Link href="/">
              <span
                className={`text-xl font-bold text-gray-900 dark:text-white transition-opacity duration-500 ${showLogo ? "opacity-100" : "opacity-0"}`}
              >
                CoVenku
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navbarItems.map((item) => {
              // Skip Account link if logged in (we use UserMenu instead)
              if (item.label === "Account" && isAuthenticated) {
                return null;
              }
              const href =
                item.label === "Account" && !isAuthenticated
                  ? "/Login_Register"
                  : item.href;
              return (
                <Link
                  key={item.id}
                  href={href}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu - only when logged in */}
            {isAuthenticated && <UserMenu />}

            {/* Login button if not logged in */}
            {!isAuthenticated && (
              <Link
                href="/Login_Register"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Přihlásit
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && <UserMenu />}
            <button
              onClick={toggleMenu}
              aria-label="Toggle Menu"
              className="p-2 text-gray-700 dark:text-gray-300"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-2 pt-2 pb-3 space-y-1">
          {navbarItems.map((item) => {
            if (item.label === "Account" && isAuthenticated) {
              return null;
            }
            const href =
              item.label === "Account" && !isAuthenticated
                ? "/Login_Register"
                : item.href;
            return (
              <Link
                key={item.id}
                href={href}
                className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          {!isAuthenticated && (
            <Link
              href="/Login_Register"
              className="block px-3 py-2 mt-2 bg-indigo-600 text-white text-center rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Přihlásit
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
