const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Movie = require("../models/Movie");

// CREATE a booking
const createBooking = async (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            movie,
            showDate,
            showTime,
            ticketCount
        } = req.body;

        // Check whether the movie ID is valid
        if (!mongoose.isValidObjectId(movie)) {
            return res.status(400).json({
                message: "Invalid movie ID"
            });
        }

        // Find the selected movie
        const selectedMovie = await Movie.findById(movie);

        if (!selectedMovie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        // Calculate the total price on the server
        const totalPrice = selectedMovie.ticketPrice * Number(ticketCount);

        // Create the booking
        const booking = await Booking.create({
            customerName,
            customerEmail,
            movie,
            showDate,
            showTime,
            ticketCount,
            totalPrice
        });

        res.status(201).json({
            message: "Booking created successfully",
            booking
        });

    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                message: error.message
            });
        }

        console.error("Booking creation error:", error.message);

        res.status(500).json({
            message: "Failed to create booking"
        });
    }
};

// READ all bookings
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("movie", "title genre ticketPrice")
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);

    } catch (error) {
        console.error("Booking retrieval error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve bookings"
        });
    }
};

// READ one booking
const getBookingById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid booking ID"
            });
        }

        const booking = await Booking.findById(req.params.id)
            .populate("movie", "title genre ticketPrice");

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json(booking);

    } catch (error) {
        console.error("Booking retrieval error:", error.message);

        res.status(500).json({
            message: "Failed to retrieve booking"
        });
    }
};

module.exports = {
    createBooking,
    getBookings,
    getBookingById
};