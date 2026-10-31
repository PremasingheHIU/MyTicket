const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER a new customer
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check whether all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email, and password."
            });
        }

        // Check the name length
        if (name.trim().length < 2) {
            return res.status(400).json({
                message: "Name must contain at least 2 characters."
            });
        }

        // Check the password length
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check whether the email is already registered
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "This email is already registered. Please log in."
            });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user account
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        // Create a login token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Return the account details without the password
        return res.status(201).json({
            message: "Account created successfully.",
            token,
           user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
        }
        });

    } catch (error) {
        // Handle duplicate email errors
        if (error.code === 11000) {
            return res.status(409).json({
                message: "This email is already registered. Please log in."
            });
        }

        console.error("Registration error:", error.message);

        return res.status(500).json({
            message: "Failed to create account."
        });
    }
};


// LOGIN an existing customer
const loginUser = async (req, res) => {
    try {
        console.log("LOGIN CONTROLLER EXECUTED");
        const { email, password } = req.body;

        // Check whether both fields are provided
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Find the registered customer
        const user = await User.findOne({
            email: normalizedEmail
        });

        console.log("User retrieved from database:", {
    email: user?.email,
    role: user?.role
});

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Compare the entered password with the stored hash
        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Create a login token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Return the token and safe user details
        return res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Failed to log in."
        });
    }
};


module.exports = {
    registerUser,
    loginUser
};