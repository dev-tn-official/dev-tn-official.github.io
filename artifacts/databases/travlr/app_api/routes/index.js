const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // Enable JSON Web Tokens

const tripsController = require("../controllers/trips");
const authController = require("../controllers/authentication");

// Method to authenticate our JWT
function authenticateJWT(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        console.log("Authorization header required but not present.");

        return res
            .status(401)
            .json({ message: "Authorization header required." });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        console.log("Invalid Authorization header.");

        return res
            .status(401)
            .json({ message: "Bearer token required." });
    }

    const token = parts[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Store decoded JWT information on the request
        req.auth = verified;

        next();
    } catch (err) {
        console.log("Token validation error:", err.message);

        return res
            .status(401)
            .json({ message: "Token validation error." });
    }
}

// Register endpoint
router
    .route("/register")
    .post(authController.register);

// Login endpoint
router
    .route("/login")
    .post(authController.login);

// Trips endpoint
router
    .route("/trips")
    .get(tripsController.tripsList)
    .post(authenticateJWT, tripsController.tripsAddTrip);

// GET Method routes tripsFindByCode - requires parameter
// PUT Method routes tripsUpdateTrip - requires parameter
// DELETE Method routes tripsDeleteTrip - requires authentication and parameter
// Added DELETE functionality 09/17/26
router
    .route("/trips/:tripCode")
    .get(tripsController.tripsFindByCode)
    .put(authenticateJWT, tripsController.tripsUpdateTrip)
    .delete(authenticateJWT, tripsController.tripsDeleteTrip);

module.exports = router;