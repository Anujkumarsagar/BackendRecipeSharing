//model of category
//user models
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const User = require("../models/User")
const Category = require("../models/Category")
const mongoose = require("mongoose")



exports.createCategory = async (req, res) => {
    try {
        //fetch
        const { name, description } = req.body
        const image = req.files?.image;

        //validate
        if (!name || !description) {
            return res.status(400).json({ message: 'Name and description are required' });
        }

        //upload image to cloudinary
        let imageUrl;
        if (image) {
            imageUrl = await uploadImageToCloudinary(image, 'categories');
            if (!imageUrl) {
                return res.status(401).json({
                    success: false,
                    message: 'Failed to upload image to cloudinary'
                });
            }
        }

        //create a entry in database
        const category = await Category.create({
            name,
            description,
            image: imageUrl.secure_url || null
        });

        category.save();

        //update in user models

        const token = req.cookies.token;
        //decode
        const user = await User.findByIdAndUpdate(
            { _id: req.user.id },
            { $push: { categories: category._id } },
            { new: true }
        );

        res.status(200).json({
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

exports.deleteCategory = async (req, res) => {
    try {
        //fetch
        const categoryId = req.params.id;

        //validate
        if(!mongoose.Types.ObjectId.isValid(categoryId)){
            return res.status(400).json({
                success: false,
                message: 'Invalid category id'
            });
        }
        console.log(categoryId);
        //fetch category
        const category = await Category.findById(categoryId);

        if(!category){
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        //delete
        await Category.findByIdAndDelete(categoryId);

        //update user
        const token = req.cookies.token;
        const user = await User.findByIdAndUpdate(
            {token},
            {$pull: {categories: categoryId}},
            {new: true}
        );  

        // //delete category from cloudinary   
        // if(category.image){
        //     await deleteImageFromCloudinary(category.image);

        // }

        return res.status(200).json({

            success: true,
            message: 'Category deleted successfully',
            
        })

        


    }catch(error){
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
         });
    }

}



