const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingLeaveById,
  accessBookingByUser,
  getBooking,
  getBookingLeaveByvnpayId,
  getBookingLeaveByuserId,
  stepStatus
} = require("../controllers/booking.controller.js");

router.post("/create", createBooking);
router.get("", getBooking);

router.put('/update-status/:id', stepStatus);

router.post("/accessBooking", accessBookingByUser);
// router.post("/:id", BookingController.getOne)
router.get("/find/:leaseId", getBookingLeaveById);
router.get("/infor/:vnpayId", getBookingLeaveByvnpayId);
router.get("/:userId", getBookingLeaveByuserId);

module.exports = router;
