const prisma = require("../config/db");

async function getAllMovies({ page, limit } = {}) {
  // TODO: add pagination in the future (preserved intentional TODO) (Zala bhaii)
  if (page !== undefined || limit !== undefined) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 8;
    const skip = (pageNum - 1) * limitNum;

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" }
      }),
      prisma.movie.count()
    ]);

    return {
      movies,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    };
  }

  return await prisma.movie.findMany({
    orderBy: { createdAt: "desc" }
  });
}

async function createMovie({ title, year, genre, description, externalId }) {
  if (!title?.trim()) {
    throw new Error("Title is required");
  }

  let parsedYear = null;

  if (year !== undefined && year !== null && year !== "") {
    parsedYear = Number(year);

    if (Number.isNaN(parsedYear)) {
      throw new Error("Year must be a number");
    }

    if (
      parsedYear < 1888 ||
      parsedYear > new Date().getFullYear()
    ) {
      throw new Error("Invalid movie year");
    }
  }

  return await prisma.movie.create({
    data: {
      title: title.trim(),
      year: parsedYear,
      genre,
      description,
      externalId
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
