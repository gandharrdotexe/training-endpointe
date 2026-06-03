"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { token, user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
    router.push("/login");
  };

  const isActive = (path) => pathname === path;

  return (
    <header className="bg-[#0c0c0c] border-b border-[#564d4d]/20 relative z-50 shadow-md">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Branding & Desktop Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-[#db0000] text-2xl font-extrabold tracking-wider hover:opacity-90 transition-opacity">
            ENFLIX
          </Link>

          {/* Desktop Links */}
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors hover:text-white ${
                isActive("/") ? "text-white" : "text-gray-400"
              }`}
            >
              Home
            </Link>
            <Link
              href="/movies"
              className={`transition-colors hover:text-white ${
                isActive("/movies") ? "text-white" : "text-gray-400"
              }`}
            >
              Movies
            </Link>
            {token && (
              <Link
                href="/dashboard"
                className={`transition-colors hover:text-white ${
                  isActive("/dashboard") ? "text-white" : "text-gray-400"
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Desktop User Section & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          {/* Desktop User Section */}
          <div className="hidden sm:flex items-center gap-4">
            {token ? (
              <>
                <span className="text-xs text-gray-400">
                  Hello, <strong className="text-gray-200">{user?.name || user?.email}</strong>
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-[#db0000] hover:bg-[#831010] text-white px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 transform active:scale-95 shadow-md shadow-[#db0000]/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-[#db0000] hover:bg-[#831010] text-white px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 block text-center shadow-md shadow-[#db0000]/10"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Hamburger Icon for Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="sm:hidden text-gray-400 hover:text-white focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Expandable menu) */}
      <div
        className={`sm:hidden bg-[#0c0c0c] border-t border-[#564d4d]/10 px-6 py-4 space-y-4 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-3 text-sm font-medium">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`transition-colors hover:text-white ${
              isActive("/") ? "text-white" : "text-gray-400"
            }`}
          >
            Home
          </Link>
          <Link
            href="/movies"
            onClick={() => setIsOpen(false)}
            className={`transition-colors hover:text-white ${
              isActive("/movies") ? "text-white" : "text-gray-400"
            }`}
          >
            Movies
          </Link>
          {token && (
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`transition-colors hover:text-white ${
                isActive("/dashboard") ? "text-white" : "text-gray-400"
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Mobile Authentication Area */}
        <div className="pt-4 border-t border-[#564d4d]/10 flex flex-col gap-3">
          {token ? (
            <div className="flex flex-col gap-3">
              <span className="text-xs text-gray-400">
                Hello, <strong className="text-gray-200">{user?.name || user?.email}</strong>
              </span>
              <button
                onClick={handleSignOut}
                className="bg-[#db0000] hover:bg-[#831010] text-white py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 w-full text-center"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="bg-[#db0000] hover:bg-[#831010] text-white py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 block text-center w-full"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
