const express = require("express");
const router = express.Router();
const cartItemController = require("../controllers/cartItem.controller");

router.post("/", cartItemController.createCartItem);
router.post("/many", cartItemController.createManyCartItems);
router.get("/", cartItemController.getAllCartItems);
router.get("/:id", cartItemController.getCartItemById);
router.patch("/:id", cartItemController.updateCartItem);
router.delete("/:id", cartItemController.deleteCartItem);

module.exports = router;
