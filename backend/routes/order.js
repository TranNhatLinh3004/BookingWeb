const express = require("express");
const router = express.Router();
const { accessBookingbyUser } = require("../controllers/order.controller");

router.post("/accessBooking", accessBookingbyUser);
module.exports = router;
