const express = require("express");
const authRoutes = require("./authRoutes");
const movieRoutes = require("./movieRoutes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", phase: "phase-1-to-phase-4-mix" });
});

router.use("/auth", authRoutes);
router.use("/movies", movieRoutes);

module.exports = router;
