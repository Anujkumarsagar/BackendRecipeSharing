const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String], // Array of strings for ingredients
    required: true
  },
  instructions: {
    type: [String], // Array of strings for step-by-step instructions
    required: true
  },
  category: {
   type: mongoose.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  author: {
    type: Schema.Types.ObjectId, // Reference to the User who created the recipe
    ref: 'User',
    required: true
  },
  image: {
    type: String, // URL to recipe image
    default: "" // Default value if no image is provided
  },
  likes: {
    type: Number,
    default: 0 // Starts with zero likes
  },
  comment: {
    type: mongoose.Types.ObjectId,
    ref: "Comment"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);

