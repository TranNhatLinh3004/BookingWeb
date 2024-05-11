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
      nameHotel: bookingData.nameHotel,
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
const activateBooking = async (bookingId) => {
  try {
    // Tìm booking trong cơ sở dữ liệu
    const booking = await Booking.findById(bookingId);
    console.log(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Đánh dấu booking là đã kích hoạt (active = true)
    booking.active = true;

    // Lưu thay đổi vào cơ sở dữ liệu
    await booking.save();
  } catch (error) {
    console.log("Error activating booking:", error);
    throw error; // Bạn có thể xử lý lỗi tùy thuộc vào yêu cầu của bạn
  }
};
const accessBooking = async (req, res) => {
  try {
    // Tìm booking trong cơ sở dữ liệu
    const booking = await Booking.findById(bookingId);
    console.log(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Đánh dấu booking là đã kích hoạt (active = true)
    booking.active = true;

    // Lưu thay đổi vào cơ sở dữ liệu
    await booking.save();
  } catch (error) {
    console.log("Error activating booking:", error);
    throw error; // Bạn có thể xử lý lỗi tùy thuộc vào yêu cầu của bạn
  }
};
const accessBookingByUser = async (req, res) => {
  try {
    const bookingId = req.body.bookingId;

    // chuyển từ active = false sang active = true trong booking -> nhiệm vụ để xác nhận booking
    await activateBooking(bookingId);

    // Lấy thông tin booking từ cơ sở dữ liệu thông qua id
    const booking = await Booking.findById(bookingId);
    
    //   // Xóa booking
    await booking.save();

    // Trả về JSON cho yêu cầu thành công
    return res.json({
      success: true,
      message: "Booking processed successfully",
    });
    // }
  } catch (error) {
    console.log("Error creating order:", error);
    // Trả về JSON cho lỗi
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the booking",
    });
  }
};

const getBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error retrieving bookings:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateRoomStatus = async (req, res) => {
  const { roomId } = req.params;
  const { status } = req.body;

  try {
    // Find the room by ID
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Update the status of the room
    room.status = status;
    await room.save();

    return res.status(200).json({ message: 'Room status updated successfully', room });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  createBooking,
  accessBookingByUser,
  getBookingLeaveById,
  updateRoomStatus,
  getBooking,
};
