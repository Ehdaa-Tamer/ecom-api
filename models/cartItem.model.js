const { default: mongoose } = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
   
    productId: 
        {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
       cartId: 
        {
          type: mongoose.Schema.ObjectId,
          ref: "Cart",
          required: true,
        },
        quantity:{
            type: Number, 
            default: 1,},
        
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const CartItem = new mongoose.model("CartItem", cartItemSchema);

module.exports = CartItem;