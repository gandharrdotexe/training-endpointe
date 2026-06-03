import "./globals.css";
import Link from "next/link";
import Providers from "../components/Providers";
import SplashScreenWrapper from "../components/SplashScreenWrapper";

export const metadata = {
  title: "ENFLIX | Premium Streaming",
  description: "Cinematic movie management platform."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen text-white select-none">
        <Providers>
          <SplashScreenWrapper>
            <header className="bg-[#000000] border-b border-[#564d4d]/30 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
              <div className="flex items-center gap-8">
                <Link href="/" className="text-[#db0000] text-3xl font-bold tracking-wider hover:text-white transition-colors" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  ENFLIX
                </Link>
                <nav className="flex items-center gap-6 text-sm font-medium">
                  <Link href="/" className="text-gray-300 hover:text-[#db0000] transition-colors no-underline">Home</Link>
                  <Link href="/movies" className="text-gray-300 hover:text-[#db0000] transition-colors no-underline">Movies</Link>
                  <Link href="/dashboard" className="text-gray-300 hover:text-[#db0000] transition-colors no-underline">Dashboard</Link>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium bg-[#db0000] hover:bg-[#831010] text-white px-4 py-2 rounded no-underline transition-all duration-300 shadow-md">
                  Sign In
                </Link>
              </div>
            </header>
            <main className="max-w-7xl mx-auto p-6 md:p-8">{children}</main>
          </SplashScreenWrapper>
        </Providers>
      </body>
    </html>
  );
}
