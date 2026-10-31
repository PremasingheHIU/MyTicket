const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. Please log in first."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find the authenticated user in MongoDB
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User account not found."
            });
        }

        // Attach the current user details to the request
        req.user = user;

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Invalid or expired token. Please log in again."
            });
        }

        console.error("Authentication error:", error.message);

        return res.status(500).json({
            message: "Authentication failed."
        });
    }
};

module.exports = protect;