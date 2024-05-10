const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingLeaveById,
  accessBookingByUser,
  getBooking,
} = require("../controllers/booking.controller.js");

router.post("/create", createBooking);
router.get("", getBooking);

router.post("/accessBooking", accessBookingByUser);
// router.post("/:id", BookingController.getOne)
router.get("/find/:leaseId", getBookingLeaveById);

module.exports = router;
