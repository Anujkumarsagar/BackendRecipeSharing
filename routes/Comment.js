const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth.js");
const {
    createComment,
    getCommentsByRecipe,
    updateComment,
    deleteComment
} = require("../controllers/Comment.js");

// Create a new comment (requires authentication)
router.post("/:recipeId", auth, createComment);

// Get all comments for a specific recipe
router.get("/:recipeId", getCommentsByRecipe);

// Update a comment (requires authentication)
router.put("/:commentId", auth, updateComment);

// Delete a comment (requires authentication)
router.delete("/:commentId", auth, deleteComment);

module.exports = router;
