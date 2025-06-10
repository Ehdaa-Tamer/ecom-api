const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");

router
  .route("/")
  .post(reviewController.createReview)
  .get(reviewController.getAllReviews);

router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview)

  

module.exports = router;
