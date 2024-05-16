const express = require('express');
const router = express.Router();
const {createReview, getAllReviews, getReviewById, updateReview, deleteReview} = require('../controllers/review.controller');

// Tạo mới một review
router.post('/', createReview);

// Lấy tất cả các review
router.get('/', getAllReviews);

// Lấy review theo ID
router.get('/:id', getReviewById);

// Cập nhật review
router.put('/:id', updateReview);

// Xóa review
router.delete('/:id', deleteReview);

module.exports = router;
