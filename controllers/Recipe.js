const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const Category = require('../models/Category');
const User = require('../models/User');

const { uploadImageToCloudinary } = require('../utils/imageUploader');


exports.createRecipes = async (req, res) => {
    try {
        const { title, description, ingredients, instructions, category } = req.body;
        const image = req.files?.image;

        if (!title || !description || !ingredients || !instructions || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const [categoryExists, imageUrl] = await Promise.all([
            Category.findById(category),
            image ? uploadImageToCloudinary(image, "Recipes") : null
        ]);

        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: "Category not found"
            });
        }

        if (image && !imageUrl) {
            return res.status(500).json({ message: "Failed to upload image" });
        }

        const newRecipe = new Recipe({
            title,
            description,
            ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(",").map(item => item.trim()),
            instructions: Array.isArray(instructions) ? instructions : instructions.split(",").map(item => item.trim()),
            category,
            author: req.user.id,
            image: imageUrl?.secure_url || ''
        });

        const [savedRecipe, updatedUser] = await Promise.all([
            newRecipe.save(),
            User.findByIdAndUpdate(
                req.user.id,
                { $push: { recipes: newRecipe._id } },
                { new: true }
            )
        ]);

        res.status(201).json({
            success: true,
            message: "Recipe created successfully",
            recipe: savedRecipe,
            user: updatedUser
        });

    } catch (error) {
        console.error("Error creating recipe:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the recipe",
            error: error.message
        });
    }
};

exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('author', 'name').populate('category', 'name');
        res.status(200).json({
            success: true,
            data: recipes
        });
    } catch (error) {
        console.error('Error in getAllRecipes:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching recipes",
            error: error.message
        });
    }
};

exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('author', 'name').populate('category', 'name');
        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found"
            });
        }
        res.status(200).json({
            success: true,
            data: recipe
        });
    } catch (error) {
        console.error('Error in getRecipeById:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching recipe",
            error: error.message
        });
    }
};

exports.updateRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, instructions, category } = req.body;
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found"
            });
        }
        // console.log(recipe.author._id.toString());
        // console.log(req.user.id.toString());

        if (recipe.author._id.toString() !== req.user.id.toString()) {

            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this recipe"
            });
        }

        recipe.title = title || recipe.title;
        recipe.description = description || recipe.description;
        recipe.ingredients = ingredients ? ingredients.split(",") : recipe.ingredients;
        recipe.instructions = instructions ? instructions.split(",") : recipe.instructions;
        recipe.category = category || recipe.category;

        await recipe.save();

        res.status(200).json({
            success: true,
            data: recipe
        });
    } catch (error) {
        console.error('Error in updateRecipe:', error);
        res.status(500).json({
            success: false,
            message: "Error updating recipe",
            error: error.message
        });
    }
};

exports.deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found"
            });
        }

        if (recipe.author._id.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this recipe"
            });
        }

        await Recipe.findByIdAndDelete(req.params.id);

        //delete from the user recipes
        await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { recipes: req.params.id } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Recipe deleted successfully"
        });
    } catch (error) {
        console.error('Error in deleteRecipe:', error);
        res.status(500).json({
            success: false,
            message: "Error deleting recipe",
            error: error.message
        });
    }
};

exports.searchRecipes = async (req, res) => {
    try {
        const { query } = req.query;
        const recipes = await Recipe.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { ingredients: { $elemMatch: { $regex: query, $options: 'i' } } }
            ]
        }).populate('author', 'name').populate('category', 'name');

        res.status(200).json({
            success: true,
            data: recipes
        });
    } catch (error) {
        console.error('Error in searchRecipes:', error);
        res.status(500).json({
            success: false,
            message: "Error searching recipes",
            error: error.message
        });
    }
};

exports.getRecipesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID"
            });
        }

        const recipes = await Recipe.find({ category: categoryId }).populate('author', 'name').populate('category', 'name');
        res.status(200).json({
            success: true,
            data: recipes
        });
    } catch (error) {
        console.error('Error in getRecipesByCategory:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching recipes by category",
            error: error.message
        });
    }
};
