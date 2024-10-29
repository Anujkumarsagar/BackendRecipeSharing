const dotenv = require("dotenv")
const User = require("../models/User")
const jwt = require("jsonwebtoken")

dotenv.config();

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "").trim();

        if (!token) {
            console.warn(`Unauthorized access attempt: ${req.ip} tried to access ${req.originalUrl}`);
            return res.status(401).json({
                success: false,
                message: "Token missing. Please log in."
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;
            next();
        } catch (jwtError) {
            console.warn(`Invalid token attempt from IP: ${req.ip} - ${jwtError.message}`);
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please log in again."
            });
        }
    } catch (error) {
        console.error("Error in auth middleware:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during authentication."
        });
    }
};

exports.isCreator = async (req, res, next) => {
    try {
        console.log("User account type:", req.user.role);
        if (req.user.role !== "creator") {
            return res.status(403).json({
                success: false,
                message: "Only creators can access this route"
            });
        }
        next();
    } catch (error) {
        console.error("Error in isCreator middleware:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}