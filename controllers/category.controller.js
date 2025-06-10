const Category = require("../models/category.model");

// Create a single category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const newCategory = await Category.create({ name, description });

    res.status(201).json({
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("❌ Create Category Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create multiple categories
exports.createManyCategories = async (req, res) => {
  try {
    const categories = req.body;

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: "Provide an array of categories" });
    }

    const created = await Category.insertMany(categories);

    res.status(201).json({
      message: `${created.length} categories created`,
      data: created,
    });
  } catch (error) {
    console.error("❌ Bulk Create Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.error("❌ Get Categories Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    console.error("❌ Get Category by ID Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update category by ID
exports.updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("❌ Update Category Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Category Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
