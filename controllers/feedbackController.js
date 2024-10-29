// controllers/feedbackController.js

const Feedback = require('../models/Feedback');

// Submit feedback
const submitFeedback = async (req, res) => {
  const { name, email, message, rating } = req.body;
  console.log(name, email, message, rating)

  //find if email already in feedback 
  const existingFeedback = await Feedback.findOne({ email });
  if (existingFeedback) {
    return res.status(400).json({ error: 'Email already in use.' });
  }

  // Simple validation
  if (!name || !email || !message || !rating) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Create feedback entry
  try {
    const feedback = await Feedback.create({ name, email, message, rating });
    res.status(201).json({ message: 'Feedback submitted successfully!', feedback });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback.' });
  }
};

// Get all feedbacks
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve feedbacks.' });
  }
};

module.exports = {
  submitFeedback,
  getFeedbacks,
};
