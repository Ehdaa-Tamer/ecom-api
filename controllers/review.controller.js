const Review = require("../models/review.model");
const Product = require("../models/product.model");

// Create Review
exports.createReview = async (req, res) => {
  try {
    const { content, rating, productId, userId } = req.body;

    const review = await Review.create({ content, rating, productId, userId });

    await Product.findByIdAndUpdate(productId, {
      $push: { reviews: review._id },
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    await Product.findByIdAndUpdate(review.productId, {
      $pull: { reviews: review._id },
    });

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Review
exports.updateReview = async (req, res) => {
  try {
    const { content, rating } = req.body;
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      { content, rating },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// Get All Reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name email") // Adjust fields if needed
      .populate("productId", "name");

    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Single Review
exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("userId", "name")
      .populate("productId", "name");

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


