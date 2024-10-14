const express = require("express");
const router = express.Router();

//fetch all controllers 
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../controllers/CategoryController");
const { auth, isCreator } = require("../middleware/auth");


//routes 

//create category
router.post("/create", auth, isCreator, createCategory);

//get all categories
router.get("/all", getAllCategories);

//get category by id
router.get("/:id", getCategoryById);

//update category
router.put("/:id", auth, isCreator, updateCategory);

//delete category
router.delete("/:id", auth, isCreator, deleteCategory);


// GET: For retrieving data
// POST: For creating new resources
// PUT: For updating entire resources
// PATCH: For partial updates to resources
// DELETE: For removing resources

module.exports = router;
