const express = require("express");
const dotenv = require("dotenv");
const { connect } = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require('express-fileupload');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Add this line

dotenv.config();

const PORT = process.env.PORT || 3001; // Change this line
const app = express();

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Add this line
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp"
}));

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL , // Replace with your frontend URL
    credentials: true, // This allows cookies to be sent with requests
    optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});


// Mount routes
app.use("/api/auth", require("./routes/Authentication.js"));
app.use("/api/category", require("./routes/Category.js"))
app.use("/api/user", require("./routes/User.js"));
app.use("/api/recipe", require("./routes/Recipe.js"));
// Use feedback routes
app.use('/api/feedback', require("./routes/feedbackRoutes.js"));
//setting
app.use("/api/setting", require("./routes/Setting.js"));
app.use("/api/comment", require("./routes/Comment.js")); // Add this line for comment routes

// Root route
app.get("/", (req, res) => {
    res.send("<h1>Recipe Sharing API</h1>");
});

// Connect to database and cloud services
connect();
cloudinaryConnect();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: err.message
    });
});
