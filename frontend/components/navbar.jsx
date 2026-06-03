"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { token, user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut();
    router.push("/login");
  };

  const isActive = (path) => pathname === path;

  return (
    <header className="bg-[#0c0c0c] border-b border-[#564d4d]/20 px-6 py-4 flex items-center justify-between shadow-md">
      {/* Branding */}
      <div className="flex items-center gap-8">
        <Link href="/" className="text-[#db0000] text-2xl font-extrabold tracking-wider hover:opacity-90 transition-opacity">
          ENFLIX
        </Link>

        {/* Navigation Links */}
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

      {/* User Section (Sign In / Sign Out) */}
      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-xs text-gray-400">
              Hello, <strong className="text-gray-200">{user?.name || user?.email}</strong>
            </span>
            <button
              onClick={handleSignOut}
              className="bg-[#db0000] hover:bg-[#831010] text-white px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 transform active:scale-95 shadow-md shadow-[#db0000]/10"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-[#db0000] hover:bg-[#831010] text-white px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 block text-center shadow-md shadow-[#db0000]/10"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
