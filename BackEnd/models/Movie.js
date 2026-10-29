const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Movie title is required"],
            trim: true
        },

        genre: {
            type: String,
            required: [true, "Movie genre is required"],
            trim: true
        },

        duration: {
            type: Number,
            required: [true, "Movie duration is required"],
            min: [1, "Duration must be greater than zero"]
        },

        description: {
            type: String,
            required: [true, "Movie description is required"],
            trim: true
        },

        poster: {
            type: String,
            default: ""
        },

        ticketPrice: {
            type: Number,
            required: [true, "Ticket price is required"],
            min: [0.01, "Ticket price must be greater than zero"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Movie", movieSchema);