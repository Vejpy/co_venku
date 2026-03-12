"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { navbarItems } from "../../utils/navbarData";
import ThemeToggle from "../ui/ThemeToggle";
import UserMenu from "../ui/UserMenu";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const LOGO_SCROLL_THRESHOLD = 100;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const pathname = usePathname();
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

  const isProtectedPath = pathname.startsWith("/user") || pathname.startsWith("/admin") || pathname.startsWith("/organizer");

  return (
    <nav className="sticky top-0 left-0 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300 z-50">
      <div className="max-w-7xl mx-auto pl-2 pr-4 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8">
        <div className="flex items-center justify-between min-h-16">
          <div className="shrink-0">
            <Link href="/">
              <span
                className={`text-xl font-bold text-zinc-900 dark:text-white transition-opacity duration-500 ${showLogo ? "opacity-100" : "opacity-0"}`}
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
              const isActive = pathname === href;
              return (
                <Link
                  key={item.id}
                  href={href}
                  className={`font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
              className="p-2 text-zinc-700 dark:text-zinc-300"
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
        <div className="md:hidden bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 px-2 pt-2 pb-3 space-y-1">
          {navbarItems.map((item) => {
            if (item.label === "Account" && isAuthenticated) {
              return null;
            }
            const href =
              item.label === "Account" && !isAuthenticated
                ? "/Login_Register"
                : item.href;
            const isActive = pathname === href;
            return (
              <Link
                key={item.id}
                href={href}
                className={`block px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30"
                    : "text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          {!isAuthenticated && (
            <Link
              href="/Login_Register"
              className="block px-3 py-2 mt-2 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
