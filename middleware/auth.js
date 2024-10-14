const dotenv = require("dotenv")
const User = require("../models/User")
const jwt = require("jsonwebtoken")

dotenv.config();

exports.auth = async (req, res, next) => {
    try {
        console.log("Cookies:", req.cookies);
        console.log("Authorization header:", req.header("Authorization"));

        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "").trim();

        console.log("Extracted token:", token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token Missing",
            });
        }

        try {
            const decode = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decode;
            console.log(req.user);
            next();
        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

    } catch (error) {
        console.error("Error in auth middleware:", error);
        return res.status(500).json({
            success: false,
            message: "Authentication Failed",
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