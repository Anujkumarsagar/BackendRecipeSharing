const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // Reference to the User who posted the comment
    ref: 'User',
    required: true
  },
  recipeId: {
    type: Schema.Types.ObjectId, // Reference to the Recipe being commented on
    ref: 'Recipe',
    required: true
  },
  commentText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
