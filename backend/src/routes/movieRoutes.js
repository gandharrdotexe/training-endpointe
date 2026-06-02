const express = require("express");
const movieController = require("../controllers/movieController");

const router = express.Router();

router.get("/dummy", movieController.getDummyMovies);
router.get("/", movieController.getMovies);
router.post("/", movieController.create);
router.put("/:id", movieController.update);
router.delete("/:id", movieController.remove);
router.post("/sync", movieController.sync);

module.exports = router;
