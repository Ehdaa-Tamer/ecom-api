const Cart = require("../models/cart.model");
const CartItem = require("../models/cartItem.model");
const Product = require("../models/product.model");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Get all carts (admin only)
exports.getAllCarts = catchAsync(async (req, res) => {
  const carts = await Cart.find()
    .populate("userId")
    .populate("items");

  res.status(200).json({ status: "success", data: carts });
});




// Create a cart
exports.createCart = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) return next(new AppError("User ID is required", 400));

  const existingCart = await Cart.findOne({ userId });
  if (existingCart)
    return next(new AppError("Cart already exists for this user", 400));

  const cart = await Cart.create({ userId });
  res.status(201).json({ status: "success", data: cart });
});


// Delete a cart
exports.deleteCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findByIdAndDelete(req.params.id);
  if (!cart) return next(new AppError("Cart not found", 404));
  await CartItem.deleteMany({ cartId: req.params.id }); // Clean up
  res.status(204).json({ status: "success", data: null });
});


