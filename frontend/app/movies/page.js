"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MovieCard from "../../components/MovieCard";
import { addMovie, setMovies } from "../../store/slices/movieSlice";
import { createMovie } from "../../lib/api";

export default function MoviesPage() {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movies.list);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    fetch(`${baseUrl}/api/movies`)
      .then((res) => res.json())
      .then((data) => {
        dispatch(setMovies(data));
      });
  }, [dispatch]);

  async function handleAddMovie() {
    const payload = { title, year, genre: "Drama", description: "Added quickly" };
    const created = await createMovie(payload);
    dispatch(addMovie(created));
    setTitle("");
    setYear("");
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Movies</h1>

      <div className="bg-white border rounded p-4 mb-6">
        <h2 className="font-semibold mb-2">Quick Add Movie</h2>
        <input
          className="border p-2 mr-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Movie title"
        />
        <input
          className="border p-2 mr-2"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
        />
        <button
          className="bg-blue-600 text-white px-3 py-2 rounded"
          onClick={handleAddMovie}
        >
          Add
        </button>
      </div>

      {/* TODO: no loading/error states */}
      {movies.map((movie) => (
        <MovieCard key={movie.id || `${movie.title}-${movie.year}`} movie={movie} />
      ))}
    </div>
  );
}
