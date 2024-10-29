//model of category
//user models
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const User = require("../models/User")
const Category = require("../models/Category")
const mongoose = require("mongoose")


exports.createCategory = async (req, res) => {
    try {
        // Fetch input data
        const { name, description } = req.body;
        const image = req.files?.image;

        // Validate input
        if (!name || !description) {
            console.log('Name and description are required:', { name, description });
            return res.status(400).json({ message: 'Name and description are required' });
        }

        // Upload image to Cloudinary
        let imageUrl = null; // Initialize imageUrl
        if (image) {
            const uploadResult = await uploadImageToCloudinary(image, 'categories');
            if (!uploadResult || !uploadResult.secure_url) {
                return res.status(401).json({
                    success: false,
                    message: 'Failed to upload image to Cloudinary'
                });
            }
            imageUrl = uploadResult.secure_url; // Get the secure URL after successful upload
            console.log('Image uploaded to Cloudinary:', imageUrl);
        }

        // Create a new category in the database
        const category = await Category.create({
            name,
            description,
            image: imageUrl // Set the image URL if it exists
        });

        // Update the user's categories
        const userId = req.user.id; // Get the user ID from the request
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { categories: category._id } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the created category
        return res.status(200).json({
            success: true,
            message: 'Category created successfully',
            category
        });

    } catch (error) {
        console.error('Error during category creation:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Additional controller names and hints:

// getAllCategories
// Hint: Fetch all categories from the database

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            categories
        });
    } catch (error) {

        console.error('Error fetching categories:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });

    }
}

// getCategoryById
// Hint: Fetch a single category by its ID

exports.getCategoryById = async (req, res) => {x``
    try {
        //fetc id 

        const categoryId = req.params.id;
        
        //validate

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category id'
            });
        }

        //fetch category

        const category = await Category.findByIdAndDelete(categoryId);

        if (category) {
            return res.status(404).json({
                success: false,
                message: 'Category deleted successfully'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Category fetched successfully',
            category
        });


    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error',
            error: error.message
         });

    }
}

// updateCategory
// Hint: Update an existing category's details

exports.updateCategory = async (req, res) => {
    try {
        //fetch
        const categoryId = req.params.id;
        const { name, description } = req.body;
        const image = req.files?.image;

        //validate
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category id'
            });
        }

        //fetch 
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        //update

        category.name = name || category.name;
        category.description = description || category.description;
        if (image) {

            category.image = await uploadImageToCloudinary(image, 'categories') || category.image;
        }

        //save
        await category.save();

        return res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category
        });


    }catch(error){
        return res.status(500).json({ 

            success: false,
            message: 'Internal Server Error'
         });


    }
        
}
// deleteCategory

// Hint: Remove a category and update related user documents


// deleteCategory
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ success: false, message: 'Invalid category id' });
        }

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        await Category.findByIdAndDelete(categoryId);

        // Update user
        const user = await User.findByIdAndUpdate(
            req.user.id, // Use the correct user id
            { $pull: { categories: categoryId } },
            { new: true }
        );

        // Uncomment if you want to delete the image from Cloudinary
        if (category.image) {
            await deleteImageFromCloudinary(category.image);
        }

        return res.status(200).json({ success: true, message: 'Category deleted successfully' });

    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}



