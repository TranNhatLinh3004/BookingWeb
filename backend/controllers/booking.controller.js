const Room = require("../models/Room");
const Booking = require("../models/booking");
const User = require("../models/user");
// const Room = require("../models/room");
const createBooking = async (req, res) => {
  const leaseId = req.body.leaseId;
  const bookingData = req.body;
  if (!leaseId) {
    return res.status(400).json("User id is required");
  }
  try {
    const booking = new Booking({
      leaseId: leaseId,
      name: bookingData.name,
      phone: bookingData.phone,
      hotel: bookingData.hotel,
      rooms: bookingData.rooms.map((room) => ({
        roomId: room.roomId,
        price: room.price,
        roomNumbers: room.roomNumbers.map((roomNumber) => ({
          number: roomNumber.number,
          unavailableDates: roomNumber.unavailableDates,
        })),
      })),
      //active: bookingData.active,
    });
    for (const room of booking.rooms) {
      for (const roomNumber of room.roomNumbers) {
        await Room.updateOne(
          { _id: room.roomId, "roomNumbers.number": roomNumber.number },
          {
            $push: {
              "roomNumbers.$.unavailableDates": {
                $each: roomNumber.unavailableDates,
              },
            },
          }
        );
      }
    }
    const savedBooking = await booking.save();
    res.status(200).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
  }
};
const getBookingLeaveById = async (req, res) => {
  try {
    const booking = await Booking.find({ leaseId: req.params.leaseId });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createBooking,
  getBookingLeaveById,
};
