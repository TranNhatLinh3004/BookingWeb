const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    leaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: { type: String },
    phone: { type: Number },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    nameHotel: { type: String },
    rooms: [
      {
        roomId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room",
        },
        quantity: {
          type: Number,
        },
        total: {
          type: Number,
        },
        price: {
          type: Number,
        },
        roomNumbers: [{ number: Number, unavailableDates: { type: [Date] } }],
      },
    ],
    checkinDate: {
      type: Date,
    },
    checkoutDate: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
