import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 relative">
      {/* Background soft red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#db0000] opacity-15 rounded-full blur-[100px] pointer-events-none" />

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-500 bg-clip-text text-transparent">
        Unlimited Movies, <br />
        <span className="text-[#db0000]">Cinematic</span> Control.
      </h1>
      
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
        Manage your collection, review titles, and explore analytics on the ultimate 
        streaming database dashboard. Engineered for premium entertainment enthusiasts.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 z-10">
        <Link 
          href="/movies" 
          className="bg-[#db0000] hover:bg-[#831010] text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-[#db0000]/20 transition-all duration-300 transform hover:-translate-y-0.5 no-underline"
        >
          Explore Movies
        </Link>
        <Link 
          href="/login" 
          className="bg-transparent border border-[#564d4d] hover:border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-0.5 no-underline"
        >
          Manage Dashboard
        </Link>
      </div>
    </div>
  );
}
