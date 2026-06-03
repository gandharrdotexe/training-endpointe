"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MovieCard from "../../components/MovieCard";
import { addMovie, setMovies } from "../../store/slices/movieSlice";
import { createMovie } from "../../lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

export default function MoviesPage() {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const router = useRouter();
  const movies = useSelector((state) => state.movies.list);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    fetch(`${baseUrl}/api/movies`)
      .then((res) => res.json())
      .then((data) => {
        dispatch(setMovies(data));
      });
  }, [dispatch, token, router]);

  if (!token) {
    return null;
  }

  async function handleAddMovie() {
    const payload = { title, year, genre: "Drama", description: "Added quickly" };
    const created = await createMovie(payload);
    dispatch(addMovie(created));
    setTitle("");
    setYear("");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Explore Titles</h1>
          <p className="text-gray-400 text-sm">Discover and contribute to the ENFLIX streaming catalog.</p>
        </div>
      </div>

      {/* Quick Add Movie Panel */}
      <div className="bg-[#0c0c0c] border border-[#564d4d]/40 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#db0000]" />
        <h2 className="text-lg font-bold text-white mb-4">Quick Add Movie</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 bg-black border border-[#564d4d] focus:border-[#db0000] focus:ring-1 focus:ring-[#db0000] text-white px-4 py-2.5 rounded-lg text-sm transition-all outline-none placeholder-gray-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter movie title..."
          />
          <input
            className="w-full sm:w-32 bg-black border border-[#564d4d] focus:border-[#db0000] focus:ring-1 focus:ring-[#db0000] text-white px-4 py-2.5 rounded-lg text-sm transition-all outline-none placeholder-gray-500"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Release year"
          />
          <button
            className="bg-[#db0000] hover:bg-[#831010] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-all duration-300 transform active:scale-95 shadow-lg shadow-[#db0000]/10"
            onClick={handleAddMovie}
          >
            Add Title
          </button>
        </div>
      </div>

      {/* Grid Layout of Movies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <Link href={`/movies/${movie.id}`} key={movie.id || `${movie.title}-${movie.year}`}>
            <MovieCard key={movie.id || `${movie.title}-${movie.year}`} movie={movie} />
          </Link>
          
        ))}
      </div>
    </div>
  );
}
