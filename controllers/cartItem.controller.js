const CartItem = require("../models/cartItem.model");
const Cart = require("../models/cart.model");

// Create one cart item and update the cart
exports.createCartItem = async (req, res) => {
  try {
    const cartItem = await CartItem.create(req.body);

    await Cart.findByIdAndUpdate(
      req.body.cartId,
      { $addToSet: { items: cartItem._id } }, 
      { new: true }
    );

    res.status(201).json(cartItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create many cart items 
exports.createManyCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.insertMany(req.body);

    const updates = {};

    for (let item of cartItems) {
      const cartId = item.cartId.toString();
      if (!updates[cartId]) updates[cartId] = [];
      updates[cartId].push(item._id);
    }

    await Promise.all(
      Object.entries(updates).map(([cartId, itemIds]) =>
        Cart.findByIdAndUpdate(
          cartId,
          { $addToSet: { items: { $each: itemIds } } },
          { new: true }
        )
      )
    );

    res.status(201).json(cartItems);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all cart items
exports.getAllCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find().populate("productId cartId");
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single cart item 
exports.getCartItemById = async (req, res) => {
  try {
    const cartItem = await CartItem.findById(req.params.id).populate("productId cartId");
    if (!cartItem) return res.status(404).json({ error: "CartItem not found" });
    res.status(200).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a cart item
exports.updateCartItem = async (req, res) => {
  try {
    const cartItem = await CartItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cartItem) return res.status(404).json({ error: "CartItem not found" });
    res.status(200).json(cartItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a cart item 
exports.deleteCartItem = async (req, res) => {
  try {
    const cartItem = await CartItem.findByIdAndDelete(req.params.id);
    if (!cartItem) return res.status(404).json({ error: "CartItem not found" });

    await Cart.findByIdAndUpdate(cartItem.cartId, {
      $pull: { items: cartItem._id },
    });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
