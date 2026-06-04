"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MovieCard from "../../components/MovieCard";
import { addMovie, setMovies } from "../../store/slices/movieSlice";
import { createMovie, searchExternalMovies } from "../../lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

export default function MoviesPage() {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const router = useRouter();
  const movies = useSelector((state) => state.movies.list);

  // Quick Add state
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // OMDb Search state
  const [omdbQuery, setOmdbQuery] = useState("");
  const [omdbResults, setOmdbResults] = useState([]);
  const [omdbLoading, setOmdbLoading] = useState(false);
  const [omdbError, setOmdbError] = useState("");
  const [addedIds, setAddedIds] = useState(new Set());

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

  async function handleAddMovie(e) {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    try {
      const payload = {
        title: title.trim(),
        year: year ? Number(year) : null,
        genre: "Drama",
        description: "Added quickly"
      };
      const created = await createMovie(payload);
      if (created && created.id) {
        dispatch(addMovie(created));
        setTitle("");
        setYear("");
        setIsAddModalOpen(false);
      } else {
        alert("Failed to add movie.");
      }
    } catch (err) {
      alert("Error adding movie.");
    }
  }

  // Trigger search automatically as the user types (debounced)
  useEffect(() => {
    if (!omdbQuery.trim()) {
      setOmdbResults([]);
      setOmdbError("");
      return;
    }

    setOmdbLoading(true);
    setOmdbError("");

    const delayDebounceFn = setTimeout(() => {
      searchExternalMovies(omdbQuery)
        .then((results) => {
          setOmdbResults(results);
          if (results.length === 0) {
            setOmdbError("No titles found. Try a different query.");
          }
        })
        .catch(() => {
          setOmdbError("Failed to query OMDb. Check API configuration.");
        })
        .finally(() => {
          setOmdbLoading(false);
        });
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [omdbQuery]);

  async function handleImportMovie(item) {
    try {
      const payload = {
        title: item.Title,
        year: item.Year ? parseInt(item.Year) : null,
        genre: item.Type || "Movie",
        description: "Synced from OMDb",
        externalId: item.imdbID
      };
      const created = await createMovie(payload);
      dispatch(addMovie(created));
      
      // Mark as added to prevent duplicate clicks
      setAddedIds((prev) => {
        const nextSet = new Set(prev);
        nextSet.add(item.imdbID);
        return nextSet;
      });
    } catch (err) {
      alert("Failed to save movie to database.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Explore Titles</h1>
          <p className="text-gray-400 text-sm">Discover and contribute to the ENFLIX streaming catalog.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto bg-[#db0000] hover:bg-[#831010] text-white font-semibold px-4 py-2.5 rounded-lg text-xs transition-all duration-300 transform active:scale-95 shadow-md shadow-[#db0000]/10"
        >
          + Quick Add
        </button>
      </div>

      {/* OMDb Search & Import Panel */}
      <div className="bg-[#0c0c0c] border border-[#564d4d]/40 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#db0000]" />
        <h2 className="text-lg font-bold text-white mb-4">Search & Import from OMDb API</h2>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            className="flex-1 bg-black border border-[#564d4d] focus:border-[#db0000] focus:ring-1 focus:ring-[#db0000] text-white px-4 py-2.5 rounded-lg text-sm transition-all outline-none placeholder-gray-500 w-full"
            value={omdbQuery}
            onChange={(e) => setOmdbQuery(e.target.value)}
            placeholder="Type to search OMDb titles (e.g. Inception, Avengers)..."
          />
          {omdbLoading && (
            <div className="flex items-center text-xs text-gray-400 gap-2 shrink-0 self-end sm:self-center">
              <span className="h-4 w-4 border-2 border-t-transparent border-[#db0000] rounded-full animate-spin"></span>
              <span>Searching OMDb...</span>
            </div>
          )}
        </div>

        {omdbError && (
          <p className="text-[#db0000] text-xs mt-3 font-semibold">{omdbError}</p>
        )}

        {/* OMDb Search Results Grid */}
        {omdbResults.length > 0 && (
          <div className="mt-6 space-y-4 pt-6 border-t border-[#564d4d]/20">
            <h3 className="text-sm font-semibold text-gray-400">OMDb Search Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {omdbResults.map((item) => (
                <div key={item.imdbID} className="bg-black border border-[#564d4d]/30 rounded-lg p-3 flex flex-col justify-between space-y-3">
                  <div className="flex gap-3">
                    {item.Poster && item.Poster !== "N/A" ? (
                      <img src={item.Poster} alt={item.Title} className="w-12 h-18 object-cover rounded shadow" />
                    ) : (
                      <div className="w-12 h-18 bg-[#1c1c1c] border border-[#564d4d]/20 rounded flex items-center justify-center text-xs text-gray-500">No Image</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate" title={item.Title}>{item.Title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{item.Year}</p>
                      <span className="inline-block bg-[#2c2c2c] text-gray-300 text-[10px] font-semibold px-2 py-0.5 rounded mt-1 capitalize">{item.Type}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleImportMovie(item)}
                    disabled={addedIds.has(item.imdbID)}
                    className={`w-full py-1.5 rounded text-xs font-bold transition-all ${
                      addedIds.has(item.imdbID)
                        ? "bg-green-950/40 border border-green-800 text-green-400 cursor-default"
                        : "bg-[#db0000] hover:bg-[#831010] text-white"
                    }`}
                  >
                    {addedIds.has(item.imdbID) ? "✓ Added to Catalog" : "+ Add to Catalog"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid Layout of Movies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link href={`/movies/${movie.id}`} key={movie.id || `${movie.title}-${movie.year}`}>
            <MovieCard key={movie.id || `${movie.title}-${movie.year}`} movie={movie} />
          </Link>
          
        ))}
      </div>

      {/* Quick Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm px-4">
          <div className="bg-[#0c0c0c] border border-[#564d4d]/40 rounded-xl p-6 shadow-2xl relative max-w-md w-full overflow-hidden space-y-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#db0000]" />
            
            <div>
              <h2 className="text-xl font-bold text-white">Quick Add Movie</h2>
              <p className="text-gray-400 text-xs mt-1">Create a new catalog entry directly in the database.</p>
            </div>

            <form onSubmit={handleAddMovie} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Interstellar"
                  className="w-full bg-black border border-[#564d4d] focus:border-[#db0000] focus:ring-1 focus:ring-[#db0000] text-white px-4 py-2.5 rounded-lg text-sm outline-none placeholder-gray-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Release Year</label>
                <input
                  type="number"
                  placeholder="e.g. 2014"
                  className="w-full bg-black border border-[#564d4d] focus:border-[#db0000] focus:ring-1 focus:ring-[#db0000] text-white px-4 py-2.5 rounded-lg text-sm outline-none placeholder-gray-500"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#564d4d]/20">
                <button
                  type="submit"
                  className="w-full sm:flex-1 bg-[#db0000] hover:bg-[#831010] text-white font-semibold py-2.5 rounded-lg text-sm transition-all"
                >
                  Add Title
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setTitle("");
                    setYear("");
                  }}
                  className="w-full sm:flex-1 bg-transparent border border-[#564d4d] text-gray-400 hover:text-white py-2.5 rounded-lg text-sm transition-all text-center"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
