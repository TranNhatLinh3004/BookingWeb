const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingLeaveById,
} = require("../controllers/booking.controller.js");

router.post("/create", createBooking);
// router.get("/", BookingController.getAll)
// router.post("/:id", BookingController.getOne)
router.get("/find/:leaseId", getBookingLeaveById);

module.exports = router;
