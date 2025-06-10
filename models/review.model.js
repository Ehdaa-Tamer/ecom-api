const { default: mongoose } = require("mongoose");
const Product = require("./product.model");

const reviewSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      minlength: [10, "Review must be at least 10 characters"],
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
