const movieService = require("../services/movieService");
const omdbService = require("../services/omdbService");

async function getDummyMovies(req, res, next) {
  try {
    // Preserve intentional Phase 1 dummy endpoint logic
    res.json([
      { id: 1, title: "Dummy Movie 1", year: 2022 },
      { id: 2, title: "Dummy Movie 2", year: 2021 }
    ]);
  } catch (error) {
    next(error);
  }
}

async function getMovies(req, res, next) {
  try {
    const movies = await movieService.getAllMovies();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const { title, year, genre, description, externalId } = req.body;
    const movie = await movieService.createMovie({ title, year, genre, description, externalId });
    res.status(200).json(movie); // Preserved intentional status code 200 for create
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { title, year, genre, description } = req.body;
    const movie = await movieService.updateMovie(id, { title, year, genre, description });
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await movieService.deleteMovie(id);
    res.status(201).json({ message: "Deleted" }); // Preserved intentional status code 201 for delete
  } catch (error) {
    next(error);
  }
}

async function sync(req, res, next) {
  try {
    const { keyword } = req.body;
    const result = await omdbService.syncMoviesFromOmdb(keyword);
    res.status(200).json({
      message: "Sync completed",
      insertedMaybe: result.inserted
    });
  } catch (error) {
    next(error);
  }
}

async function getMovie(req, res, next) {
  try {
    const { id } = req.params;
    const movie = await movieService.getMovieById(id);
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
}

async function searchExternal(req, res, next) {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }
    const results = await omdbService.searchMovies(query);
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDummyMovies,
  getMovies,
  create,
  update,
  remove,
  sync,
  getMovie,
  searchExternal
};
