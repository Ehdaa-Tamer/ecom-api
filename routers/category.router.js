const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

router.post("/", categoryController.createCategory);

router.post("/many", categoryController.createManyCategories);

router.get("/", categoryController.getCategories);

router.get("/:id", categoryController.getCategoryById);

router.patch("/:id", categoryController.updateCategory);

router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
