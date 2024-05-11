const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingLeaveById,
  accessBookingByUser,
  getBooking,
  updateRoomStatus,
} = require("../controllers/booking.controller.js");

router.post("/create", createBooking);
router.get("", getBooking);

router.post("/accessBooking", accessBookingByUser);
// router.post("/:id", BookingController.getOne)
router.get("/find/:leaseId", getBookingLeaveById);

// Route to update the status of a room
router.put('/:roomId/status', updateRoomStatus);

module.exports = router;
