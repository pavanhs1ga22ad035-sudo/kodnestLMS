'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'Practice', href: '/practice' },
  { label: 'Placements', href: '/placements' },
  { label: 'Community', href: '/community' },
];

const profileItems = [
  'My Account',
  'Compiler',
  'User Feedback',
  'Resume Builder',
  'Mock Interview',
  'Apply for Leave',
  'Session diaries',
  'Log Out',
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 antialiased">
        <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400 text-lg font-extrabold text-black shadow-sm">
                K
              </div>
              <span className="text-base font-semibold tracking-wide text-black">KodNest</span>
            </div>

            <nav className="hidden items-center gap-1 rounded-full bg-gray-50 px-2 py-1 shadow-inner md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-yellow-300 hover:text-black"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                aria-label="Search"
                className="rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:border-yellow-400 hover:text-black"
              >
                <SearchIcon />
              </button>

              <button
                type="button"
                aria-label="Notifications"
                className="relative rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition hover:border-yellow-400 hover:text-black"
              >
                <BellIcon />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-yellow-400" />
              </button>

              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  aria-label="User menu"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-yellow-400 bg-black text-sm font-bold text-yellow-300 shadow-sm transition hover:scale-105"
                >
                  UN
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-black">
                      Profile Menu
                    </div>
                    <ul className="max-h-80 overflow-y-auto py-2">
                      {profileItems.map((item) => (
                        <li key={item}>
                          <button
                            type="button"
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-yellow-100 hover:text-black"
                          >
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 bg-white md:hidden">
            <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
              {navItems.map((item) => (
                <Link
                  key={`mobile-${item.label}`}
                  href={item.href}
                  className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-yellow-300 hover:text-black"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M9 17a3 3 0 0 0 6 0" />
    </svg>
  );
}
