'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isWebView, setIsWebView] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('loggedUser');
    setIsLoggedIn(!!storedUser);

    // Detect if running inside a WebView
    const userAgent = navigator.userAgent || '';
    const webViewIndicators = [
      'WebView',
      'wv',
      'Android; Mobile',
      'iPhone; CPU iPhone OS',
      'iPad; CPU OS',
      'Version/',
    ];
    const isInWebView = webViewIndicators.some(indicator => userAgent.includes(indicator)) && !userAgent.includes('Safari');
    setIsWebView(isInWebView);
  }, []);

  const accountHref = isLoggedIn ? '/Account' : '/Login_Register';

  return (
    <nav className="bg-white shadow-md fixed w-full z-50" style={{ paddingTop: `calc(env(safe-area-inset-top, 0) + ${isWebView ? '0px' : '0px'})` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16">

          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-xl font-bold">CoVenku</span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href={accountHref} className="hover:text-blue-600">Account</Link>
            <Link href="/Analytics" className="hover:text-blue-600">Analytics</Link>
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
        <div className="md:hidden bg-white px-2 pt-2 pb-3 space-y-1 shadow-lg">
          <Link href="/" className="block px-3 py-2 rounded hover:bg-gray-100">Home</Link>
          <Link href={accountHref} className="block px-3 py-2 rounded hover:bg-gray-100">Account</Link>
          <Link href="/Analytics" className="block px-3 py-2 rounded hover:bg-gray-100">Analytics</Link>
        </div>
      )}
    </nav>
  );
}