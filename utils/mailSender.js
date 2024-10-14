const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    // Create a transporter object with host, port, secure, and authentication settings
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT || 587, // Ensure the port is correct
      secure: process.env.MAIL_SECURE === "true", // Set to true for port 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false  // Ignore self-signed certificates
      }
    });

    // Send mail with the defined transport object
    let info = await transporter.sendMail({
      from: '"Email From Delicious Recipes : "<samajseva62@gmail.com>', // Corrected syntax
      to: email,
      subject: title,
      html: body,
    });

    console.log("Message sent: %s", info.messageId); // Message ID logging
    return info;
  } catch (error) {
    // Improved error logging
    console.error("Error occurred while sending email:", error.message);
    throw new Error(`Failed to send email to ${email}: ${error.message}`); // Re-throw the error if needed
  }
};

module.exports = mailSender;
