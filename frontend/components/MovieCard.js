"use client";

export default function MovieCard({ movie }) {
  return (
    <div className="bg-gradient-to-br from-[#0c0c0c] to-[#050505] border border-[#564d4d]/30 rounded-xl p-5 hover:border-[#db0000] hover:shadow-lg hover:shadow-[#db0000]/5 transition-all duration-300 flex flex-col justify-between min-h-[170px] relative overflow-hidden group">
      {/* Dynamic top edge accent visible on hover */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#db0000] to-[#831010] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
      
      <div>
        <h3 className="font-bold text-lg text-white group-hover:text-[#db0000] transition-colors duration-200 line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1.5 flex gap-3">
          <span>Release: <strong className="text-gray-300">{movie.year || "NA"}</strong></span>
          <span>•</span>
          <span>Genre: <strong className="text-gray-300">{movie.genre || "Unknown"}</strong></span>
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#564d4d]/20">
        <p className="text-xs text-gray-400 line-clamp-2 italic leading-relaxed">
          {movie.description || "No movie description available."}
        </p>
      </div>
    </div>
  );
}
