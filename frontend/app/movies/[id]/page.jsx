"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import MovieCard from "../../../components/MovieCard";

export default function MovieDetailPage({ params }) {
  const { id } = params;
  const { token } = useAuth();
  const router = useRouter();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");

  // Route protection
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  // Fetch movie details
  useEffect(() => {
    if (!token || !id) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    setLoading(true);
    fetch(`${baseUrl}/api/movies/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch movie details");
        }
        return res.json();
      })
      .then((data) => {
        setMovie(data);
        setTitle(data.title);
        setYear(data.year || "");
        setGenre(data.genre || "");
        setDescription(data.description || "");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, token]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this title?")) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const res = await fetch(`${baseUrl}/api/movies/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        router.push("/movies");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete movie.");
      }
    } catch (err) {
      alert("Error deleting movie.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const res = await fetch(`${baseUrl}/api/movies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          year: Number(year),
          genre,
          description
        })
      });

      if (res.ok) {
        const updatedMovie = await res.json();
        setMovie(updatedMovie);
        setIsEditing(false);
      } else {
        alert("Failed to update movie details.");
      }
    } catch (err) {
      alert("Error updating movie.");
    }
  };

  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-400 text-sm animate-pulse">Loading movie details...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4 py-12">
        <h2 className="text-xl font-bold text-[#db0000]">Error</h2>
        <p className="text-gray-400 text-sm">{error || "Movie not found"}</p>
        <Link href="/movies" className="inline-block bg-[#db0000] text-white px-4 py-2 rounded-lg text-sm">
          Back to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/movies" className="text-xs text-gray-400 hover:text-white transition-colors">
            &larr; Back to Catalog
          </Link>
          <h1 className="text-3xl font-extrabold text-white mt-1">Title Details</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#0c0c0c] border border-[#564d4d]/40 rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#db0000]" />

        {isEditing ? (
          /* Edit Form */
          <form onSubmit={handleUpdate} className="col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-white mb-2">Edit Movie Details</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full bg-black border border-[#564d4d] focus:border-[#db0000] focus:ring-1 focus:ring-[#db0000] text-white px-4 py-2 rounded-lg text-sm outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Release Year</label>
                <input
                  type="number"
                  required
                  className="w-full bg-black border border-[#564d4d] focus:border-[#db0000] focus:ring-1 focus:ring-[#db0000] text-white px-4 py-2 rounded-lg text-sm outline-none"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Genre</label>
                <input
                  type="text"
                  className="w-full bg-black border border-[#564d4d] focus:border-[#db0000] focus:ring-1 focus:ring-[#db0000] text-white px-4 py-2 rounded-lg text-sm outline-none"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
                <textarea
                  className="w-full bg-black border border-[#564d4d] focus:border-[#db0000] focus:ring-1 focus:ring-[#db0000] text-white px-4 py-2 rounded-lg text-sm outline-none min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#db0000] hover:bg-[#831010] text-white font-semibold px-6 py-2 rounded-lg text-sm transition-all"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full sm:w-auto bg-transparent border border-[#564d4d] text-gray-400 hover:text-white px-6 py-2 rounded-lg text-sm transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* Movie Display */
          <>
            <div className="flex justify-center items-center">
              <MovieCard movie={movie} />
            </div>

            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</span>
                  <p className="text-xl font-bold text-white">{movie.title}</p>
                </div>

                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Release Year</span>
                  <p className="text-sm text-gray-300">{movie.year || "N/A"}</p>
                </div>

                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Genre</span>
                  <p className="text-sm text-gray-300">{movie.genre || "N/A"}</p>
                </div>

                {movie.description && (
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</span>
                    <p className="text-sm text-gray-400 mt-1 leading-relaxed">{movie.description}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#564d4d]/20">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto bg-[#db0000] hover:bg-[#831010] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-all shadow-md shadow-[#db0000]/10"
                >
                  Edit Details
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full sm:w-auto bg-transparent border border-[#564d4d] text-gray-400 hover:text-white hover:border-red-600 px-6 py-2.5 rounded-lg text-sm transition-all"
                >
                  Delete Title
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}