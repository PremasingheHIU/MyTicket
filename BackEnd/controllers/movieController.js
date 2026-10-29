const mongoose = require("mongoose");
const Movie = require("../models/Movie");

// CREATE a movie
const createMovie = async (req, res) => {
    try {
        const { title, genre, duration, description, poster, ticketPrice } = req.body;

        const movie = await Movie.create({
            title,
            genre,
            duration,
            description,
            poster,
            ticketPrice
        });

        res.status(201).json({
            message: "Movie created successfully",
            movie
        });
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Failed to create movie"
        });
    }
};

// READ all movies
const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });

        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve movies"
        });
    }
};

// READ one movie
const getMovieById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid movie ID"
            });
        }

        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve movie"
        });
    }
};

// UPDATE a movie
const updateMovie = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid movie ID"
            });
        }

        const allowedFields = [
            "title",
            "genre",
            "duration",
            "description",
            "poster",
            "ticketPrice"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json({
            message: "Movie updated successfully",
            movie
        });
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Failed to update movie"
        });
    }
};

// DELETE a movie
const deleteMovie = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid movie ID"
            });
        }

        const movie = await Movie.findByIdAndDelete(req.params.id);

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        res.status(200).json({
            message: "Movie deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete movie"
        });
    }
};

module.exports = {
    createMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie
};