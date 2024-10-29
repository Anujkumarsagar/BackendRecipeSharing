const express = require("express");
const dotenv = require("dotenv");
const { connect } = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require('express-fileupload');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp"
}));

// Refined CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Logging for troubleshooting CORS requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Mount routes
app.use("/api/auth", require("./routes/Authentication.js"));
app.use("/api/category", require("./routes/Category.js"));
app.use("/api/user", require("./routes/User.js"));
app.use("/api/recipe", require("./routes/Recipe.js"));
app.use('/api/feedback', require("./routes/feedbackRoutes.js"));
app.use("/api/setting", require("./routes/Setting.js"));
app.use("/api/comment", require("./routes/Comment.js"));

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
