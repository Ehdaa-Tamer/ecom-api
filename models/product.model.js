const mongoose = require("mongoose");

const dimensionSchema = new mongoose.Schema({
  length: { type: Number, min: 0 },
  width: { type: Number, min: 0 },
  height: { type: Number, min: 0 },
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Product must have a title"],
    unique: true,
    minlength: [5, "Product title must be at least 5 characters"],
    maxlength: [30, "Product title must be less than 30 characters"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must be a positive number"],
  },
  discountPercentage: {
    type: Number,
    min: [0, "Discount must be between 0 and 100"],
    max: [100, "Discount must be between 0 and 100"],
    default: 0,
  },
  rating: {
    type: Number,
    default: 0.0,
    min: [0, "Rating must be a positive number"],
    max: [5, "Rating can't exceed 5"],
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, "Stock must be a positive number"],
  },
  shippingInformation: {
    type: String,
    trim: true,
  },
  tags: {
    type: [String],
    validate: {
      validator: arr => arr.every(tag => typeof tag === "string"),
      message: "Tags must be an array of strings",
    },
    default: [],
  },
  brand: {
    type: String,
    trim: true,
  },
  weight: {
    type: Number,
    min: [0, "Weight must be a positive number"],
  },
  dimensions: dimensionSchema,
  warrantyInformation: {
    type: String,
    trim: true,
  },
  availabilityStatus: {
    type: String,
    enum: ["in_stock", "out_of_stock", "pre_order"],
    default: "in_stock",
    required: [true, "Product must have availability status"],
  },
  returnPolicy: {
    type: String,
    trim: true,
  },
  minimumOrderQuantity: {
    type: Number,
    min: [1, "Minimum order must be at least 1"],
    default: 1,
  },
  images: {
    type: [String],
    validate: {
      validator: arr => arr.every(url => typeof url === "string"),
      message: "Images must be an array of strings (URLs)",
    },
    default: [],
  },
  thumbnail: {
    type: String,
    required: [true, "Product must have a thumbnail"],
    trim: true,
  },
  orderDates: {
    type: [Date],
    default: [],
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
