const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: [true, "Customer name is required"],
            trim: true,
            minlength: [2, "Customer name must contain at least 2 characters"]
        },

        customerEmail: {
            type: String,
            required: [true, "Customer email is required"],
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please enter a valid email address"
            ]
        },

        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
            required: [true, "Please select a movie"]
        },

        showDate: {
            type: Date,
            required: [true, "Screening date is required"]
        },

        showTime: {
            type: String,
            required: [true, "Screening time is required"]
        },

        ticketCount: {
            type: Number,
            required: [true, "Ticket quantity is required"],
            min: [1, "At least one ticket must be booked"],
            validate: {
                validator: Number.isInteger,
                message: "Ticket quantity must be a whole number"
            }
        },

        totalPrice: {
            type: Number,
            required: [true, "Total price is required"],
            min: [0.01, "Total price must be greater than zero"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Booking", bookingSchema);