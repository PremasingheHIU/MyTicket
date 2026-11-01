const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Movie = require("../models/Movie");

// CREATE a booking
const createBooking = async (req, res) => {
    console.log("CREATE BOOKING FUNCTION REACHED");
    try {
        const {
            customerName,
            customerEmail,
            movie,
            showDate,
            showTime,
            ticketCount
        } = req.body;

        // Validate customer name
if (
    typeof customerName !== "string" ||
    customerName.trim().length < 2
) {
    return res.status(400).json({
        message: "Customer name must contain at least 2 characters."
    });
}

// Validate customer email
if (
    typeof customerEmail !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())
) {
    return res.status(400).json({
        message: "Please enter a valid email address."
    });
}

// Validate show date
// Validate show date
if (!showDate || Number.isNaN(Date.parse(showDate))) {
    return res.status(400).json({
        message: "Please provide a valid screening date."
    });
}

// Reject past screening dates
const selectedDate = new Date(showDate);
selectedDate.setHours(0, 0, 0, 0);

const today = new Date();
today.setHours(0, 0, 0, 0);

if (selectedDate < today) {
    return res.status(400).json({
        message: "You cannot book tickets for past dates."
    });
}

// Validate show time
const allowedShowTimes = ["10:00", "13:00", "16:00", "19:00"];

if (!allowedShowTimes.includes(showTime)) {
    return res.status(400).json({
        message: "Please select a valid screening time."
    });
}

        if (!req.user) {
    return res.status(401).json({
        message: "Please log in before booking."
    });
}
        // Validate ticket quantity
const quantity = Number(ticketCount);

if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 10
) {
    return res.status(400).json({
        message: "Ticket quantity must be a whole number between 1 and 10."
    });
}
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
        const totalPrice = selectedMovie.ticketPrice * quantity;
        
        // Create the booking and link it to the logged-in user
const booking = await Booking.create({
    customerName,
    customerEmail,
    user: req.user._id,
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

        console.error("Booking creation error:", error);

        res.status(500).json({
            message: "Failed to create booking"
        });
    }
};

// READ all bookings
// READ bookings belonging to the logged-in user
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user._id
        })
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
// READ one booking belonging to the logged-in user
const getBookingById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid booking ID"
            });
        }

        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user._id
        })
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