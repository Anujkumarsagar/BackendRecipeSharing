const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
    getProfile,
    updateProfile,
    deleteProfile,
    getAllUsers,
    getUserProfile,
    getUserRecipes,
    addToFavorites,
    removeFromFavorites,
    getFavoriteRecipes,
    updateUserSettings
} = require("../controllers/User");

// Get profile
router.get("/profile", auth, getProfile);

// Update user profile
router.put("/update-profile", auth, updateProfile);

// Delete user profile
router.delete("/delete-profile", auth, deleteProfile);

// Get user profile
router.get("/profile/:userId?", auth, getUserProfile);

// Get user recipes
router.get("/recipes/:userId?", auth, getUserRecipes);

// Add recipe to favorites
router.post("/add-favorite", auth, addToFavorites);

// Remove recipe from favorites
router.delete("/remove-favorite", auth, removeFromFavorites);

// Get favorite recipes
router.get("/favorite-recipes", auth, getFavoriteRecipes);

// Update user settings
router.put("/update-settings", auth, updateUserSettings);

// Get all users
router.get("/all-users", auth, getAllUsers);

// //do a like
// router.post("/like", auth, likeRecipe);

module.exports = router;

