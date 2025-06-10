const { default: mongoose } = require("mongoose");
const User = require("./user.model");

const cartSchema = new mongoose.Schema(
  {
   
    userId: 
        {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
      items: [{type: mongoose.Schema.ObjectId, ref: "CartItem"}],

        totalQuantity:Number,
        totalPrice:Number,
      
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// reviewSchema.pre("save", async function (next) {
//   console.log(this);

//   const product = await Product.findById(this.productId);
//   console.log(product);

//   next();
// });

module.exports = new mongoose.model("Cart", cartSchema);
