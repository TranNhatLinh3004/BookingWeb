const Review = require('../models/review');

// Tạo mới một review
const createReview = async (req, res) => {
  try {
    const { hotel, user, rating, comment } = req.body;
    const review = new Review({ hotel, user, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lấy tất cả các review
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('Hotel').populate('User');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lấy review theo ID
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('Hotel').populate('User');
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật review
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    await review.save();
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    await review.remove();
    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {createReview, getAllReviews, getReviewById, updateReview, deleteReview}
