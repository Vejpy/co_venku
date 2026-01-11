'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { navbarItems } from '../../utils/navbarData';

const LOGO_SCROLL_THRESHOLD = 100;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('loggedUser');
    setIsLoggedIn(!!storedUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > LOGO_SCROLL_THRESHOLD) {
        setShowLogo(true);
      } else {
        setShowLogo(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent z-50">
      <div className="max-w-7xl mx-auto pl-2 pr-4 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8">
        <div className="flex items-center justify-between min-h-16">

          <div className="flex-shrink-0 justify-between">
            <Link href="/">
              <span className={`text-xl font-bold transition-opacity duration-500 ${showLogo ? 'opacity-100' : 'opacity-0'}`}>
                CoVenku
              </span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-6">
            {navbarItems.map((item) => {
              const href = item.label === 'Account' && !isLoggedIn ? '/Login_Register' : item.href;
              return (
                <Link key={item.id} href={href} className="hover:text-blue-600">
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} aria-label="Toggle Menu">
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
        <div className="md:hidden bg-transparent px-2 pt-2 pb-3 space-y-1 justify-between">
          {navbarItems.map((item) => {
            const href = item.label === 'Account' && !isLoggedIn ? '/Login_Register' : item.href;
            return (
              <Link key={item.id} href={href} className="block px-3 py-2 rounded hover:bg-gray-100">
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}