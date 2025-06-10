const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.get("/", cartController.getAllCarts);
router.post("/", cartController.createCart);
router.delete("/:id", cartController.deleteCart);

module.exports = router;
