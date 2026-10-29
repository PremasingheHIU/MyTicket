const express = require("express");

const {
    createBooking,
    getBookings,
    getBookingById
} = require("../controllers/bookingController");

const router = express.Router();

// GET /api/bookings
router.get("/", getBookings);

// GET /api/bookings/:id
router.get("/:id", getBookingById);

// POST /api/bookings
router.post("/", createBooking);

module.exports = router;