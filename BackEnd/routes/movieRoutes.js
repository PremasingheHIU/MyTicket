const express = require("express");

const {
    createMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie
} = require("../controllers/movieController");

const router = express.Router();

// GET /api/movies
router.get("/", getMovies);

// GET /api/movies/:id
router.get("/:id", getMovieById);

// POST /api/movies
router.post("/", createMovie);

// PUT /api/movies/:id
router.put("/:id", updateMovie);

// DELETE /api/movies/:id
router.delete("/:id", deleteMovie);

module.exports = router;