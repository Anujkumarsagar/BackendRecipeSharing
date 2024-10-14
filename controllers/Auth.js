const bcrypt = require('bcryptjs');
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.signup = async (req, res) => {
    try {
        const { userName, email, password, confirmPassword, location, otp, accountType = "creator" } = req.body;
        const image = req.files?.image;
        console.log(userName, email, password, confirmPassword, location, otp, accountType);
        console.log(image);

        if (!userName || !email || !password || !confirmPassword || !location) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });
        if (!recentOTP || otp !== recentOTP.otp) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        }

        let imageUrl;
        if (image) {
            imageUrl = await uploadImageToCloudinary(image, "Recipes");
            if (!imageUrl) {
                return res.status(400).json({ message: 'Error uploading image' });
            }
        }

        const newUser = await User.create({
            userName,
            email,
            profilePic: imageUrl?.secure_url,
            password: await bcrypt.hash(password, 10),
            location,
            bio: null,
            contactNumber: null,
            accountType: accountType || "creator"
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: newUser
        });

    } catch (error) {
        console.error('Error during signup:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered with us. Please sign up to continue.",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            });
        }

        const token = jwt.sign(
            { email: user.email, id: user._id, role: user.accountType },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        );

        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.cookie("token", token, options).status(200).json({
            success: true,
            message: "User logged in successfully",
            user,
            token,
            role: user.accountType,
        });

    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User already exists'
            });
        }

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            numbers: true,
            specialCharacters: false
        });

        let result = await OTP.findOne({ otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                numbers: true,
                specialCharacters: false
            });
            result = await OTP.findOne({ otp });
        }

        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);

        res.status(200).json({
            success: true,
            message: `OTP Sent Successfully`,
            otp,
        });

    } catch (error) {
        console.error('Error sending OTP:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}