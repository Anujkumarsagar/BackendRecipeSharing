const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
	const otpEmailTemplate = (email, otp) => {
		return `
		  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
			<h2 style="color: #4CAF50;">Your OTP for Recipe Sharing App</h2>
			<p>Hi there,</p>
			<p>We received a request to verify your email address for your Recipe Sharing account.</p>
			<p>Your OTP (One-Time Password) is:</p>
			<h3 style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; display: inline-block; color: #333;">${otp}</h3>
			<p>Please use this OTP to complete your verification. This code will expire in 5 minutes.</p>
			<p>If you didn't request this, please ignore this email.</p>
			<p>Thank you,<br/>The Recipe Sharing App Team</p>
		  </div>
		`;
	};
	
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			otpEmailTemplate(email, otp)
		);
		console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

// Define a pre-save hook to send email before the document is saved
OTPSchema.pre("save", async function (next) {
	console.log("New document about to be saved to database");

	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;