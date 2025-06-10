const Product = require("../models/product.model");
const ApiFilters = require("../utils/apiFilter");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// GET all products with filtering, sorting, pagination
exports.getAllProducts = catchAsync(async (req, res) => {
  const filters = new ApiFilters(Product.find(), req.query)
    .filter()
    .sort()
    .fields()
    .pagination();

  const products = await filters.query;

  res.status(200).json({
    status: "success",
    results: products.length,
    data: products,
  });
});


exports.getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("categoryId", "title");
  if (!product) return next(new AppError("Product not found", 404));

  res.status(200).json({ status: "success", data: product });
});



exports.getProductReviews = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).select("reviews");
  if (!product) return next(new AppError("Product not found", 404));

  res.status(200).json({ status: "success", data: product.reviews });
});


exports.createProduct = catchAsync(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({ status: "success", data: product });
});


exports.addManyProducts = catchAsync(async (req, res, next) => {
  const products = req.body.products;

  if (!Array.isArray(products) || products.length === 0) {
    return next(new AppError("Provide an array of products", 400));
  }

  const inserted = await Product.insertMany(products, { ordered: false });

  res.status(201).json({
    status: "success",
    addedCount: inserted.length,
    data: inserted,
  });
});


exports.updateProduct = catchAsync(async (req, res, next) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedProduct) return next(new AppError("Product not found", 404));

  res.status(200).json({ status: "success", data: updatedProduct });
});


exports.deleteProduct = catchAsync(async (req, res, next) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return next(new AppError("Product not found", 404));

  res.status(204).json({ status: "success", data: null });
});
