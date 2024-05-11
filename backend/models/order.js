const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  vnpayId: {
    type: String,
  },
  rooms: [
    {
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      roomNumbers: [{ number: Number, unavailableDates: { type: [Date] } }], // Assuming room numbers are strings
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
