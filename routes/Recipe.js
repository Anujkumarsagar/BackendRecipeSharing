const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth.js");
const {
    getAllRecipes,
    getRecipeById,
    createRecipes,
    updateRecipe,
    deleteRecipe,
    searchRecipes,
    getRecipesByCategory
} = require("../controllers/Recipe.js");


// Create a new recipe
router.post("/create-recipe", auth, createRecipes);

// Get all recipes
router.get("/getAllRecipes", getAllRecipes);

// Search recipes
router.get("/search", searchRecipes);

// Get recipes by category
router.get("/category/:categoryId", getRecipesByCategory);

// Get a specific recipe by ID
router.get("/:id", getRecipeById);

// Update a recipe (requires authentication)
router.put("/:id", auth, updateRecipe);

// Delete a recipe (requires authentication)
router.delete("/:id", auth, deleteRecipe);

module.exports = router;
