const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true }, // Tham chiếu đến khách sạn
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Tham chiếu đến người dùng
  rating: { type: Number, min: 1, max: 5, required: true }, // Điểm đánh giá từ 1 đến 5
  comment: { type: String }, // Bình luận của người dùng
  createdAt: { type: Date, default: Date.now }, // Thời gian tạo đánh giá
});

module.exports = mongoose.model("Review", reviewSchema);
