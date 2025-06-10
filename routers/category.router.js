const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

// Create one category
router.post("/", categoryController.createCategory);

// Create multiple categories
router.post("/many", categoryController.createManyCategories);

// Get all categories
router.get("/", categoryController.getCategories);

// Get category by ID
router.get("/:id", categoryController.getCategoryById);

// Update category
router.patch("/:id", categoryController.updateCategory);

// Delete category
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
