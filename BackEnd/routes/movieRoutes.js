const express = require("express");

const {
    createMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie
} = require("../controllers/movieController");

const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

// Public routes: anyone can browse movies
router.get("/", getMovies);
router.get("/:id", getMovieById);

// Admin-only routes: authentication and admin role required
router.post("/", protect, requireAdmin, createMovie);
router.put("/:id", protect, requireAdmin, updateMovie);
router.delete("/:id", protect, requireAdmin, deleteMovie);

module.exports = router;