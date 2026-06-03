const prisma = require("../config/db");

async function getAllMovies() {
  // TODO: add pagination in the future (preserved intentional TODO)
  return await prisma.movie.findMany({
    orderBy: { createdAt: "desc" }
  });
}

async function createMovie({ title, year, genre, description }) {
  // TODO: fix this - no validation (preserved intentional TODO)
  return await prisma.movie.create({
    data: {
      title,
      year: Number(year),
      genre,
      description
    }
  });
}

async function updateMovie(id, { title, year, genre, description }) {
  return await prisma.movie.update({
    where: { id: Number(id) },
    data: {
      title,
      year: Number(year),
      genre,
      description
    }
  });
}

async function getMovieById(id) {
  const movie = await prisma.movie.findUnique({
    where: { id: Number(id) }
  });
  if (!movie) {
    const error = new Error("Movie not found");
    error.status = 404;
    throw error;
  }
  return movie;
}

async function deleteMovie(id) {
  return await prisma.movie.delete({
    where: { id: Number(id) }
  });
}

module.exports = {
  getAllMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieById
};
