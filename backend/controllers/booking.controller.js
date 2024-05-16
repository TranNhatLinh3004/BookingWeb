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
const getBookingLeaveByvnpayId = async (req, res) => {
  try {
    const booking = await Booking.find({
      vnpayId: req.params.vnpayId,
    });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json(error);
  }
};
const getBookingLeaveByuserId = async (req, res) => {
  try {
    const booking = await Booking.find({
      userId: req.params.userId,
    });
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

    //
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

const stepStatus = async (req, res) => {
  const { status } = req.body;
  
  try {
    // Tìm booking theo ID
    const booking = await Booking.findById(req.params.id).populate('userId');

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Cập nhật status của booking
    booking.status = status;
    await booking.save();

    // Gửi email thông báo
    const email = booking.userId.email;
    const message = `Your booking status has been updated to ${status}.`;
    await sendEmail(email, 'Booking Status Update', message);

    res.status(200).json({ message: "Booking status updated and email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  createBooking,
  accessBookingByUser,
  getBookingLeaveById,
  getBooking,
  getBookingLeaveByvnpayId,
  getBookingLeaveByuserId,
  stepStatus
};
