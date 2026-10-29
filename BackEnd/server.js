const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");
const movieRoutes = require("./routes/movieRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/movies", movieRoutes);
app.use("/api/bookings", bookingRoutes);
// Test route
app.get("/api/bookings-test", (req, res) => {
    res.send("Booking route is working!");
});
app.get("/", (req, res) => {
    res.send("MyTicket Backend is running!");
});

// Start server after connecting to MongoDB
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();