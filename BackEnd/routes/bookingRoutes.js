const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
    createBooking,
    getBookings,
    getBookingById
} = require("../controllers/bookingController");

const router = express.Router();

// GET /api/bookings - Get all bookings (authenticated users only)
router.get("/", protect, getBookings);

// GET /api/bookings/:id - Get a booking by ID (authenticated users only)
router.get("/:id", protect, getBookingById);

// POST /api/bookings - Create a booking (authenticated users only)
router.post("/", protect, createBooking);

module.exports = router;