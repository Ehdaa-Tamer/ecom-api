const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

router.post("/add-many", productController.addManyProducts);

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/:id/reviews", productController.getProductReviews);
router.post("/", productController.createProduct);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
