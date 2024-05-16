const Order = require("../models/order");
const Booking = require("../models/booking");

const activateBooking = async (bookingId) => {
  try {
    // Tìm booking trong cơ sở dữ liệu
    const booking = await Booking.findById(bookingId);
    // console.log(bookingId);
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
const accessBookingbyUser = async (req, res) => {
  try {
    const bookingId = req.body.bookingId;
    const subtotal = req.body.subtotal;
    const userId = req.body.userId;
    const name = req.body.name;
    const phone = req.body.phone;

    // chuyển từ active = false sang active = true trong booking -> nhiệm vụ để xác nhận booking
    await activateBooking(bookingId);

    // Lấy thông tin booking từ cơ sở dữ liệu thông qua id
    const booking = await Booking.findById(bookingId);

    // Kiểm tra nếu booking đã được kích hoạt (active = true)
    if (booking.active) {
      const order = new Order({
        userId: userId,
        name: name,
        phone: phone,
        rooms: booking.rooms.map((room) => ({
          roomId: room.roomId,
          roomNumbers: room.roomNumbers.map((roomNumber) => ({
            number: roomNumber.number,
            unavailableDates: roomNumber.unavailableDates,
          })),
        })),
        totalPrice: subtotal,
      });
      //lưu vào database
      await order.save();

      // Xóa booking
      await booking.deleteOne();

      // Trả về JSON cho yêu cầu thành công
      return res.json({
        success: true,
        message: "Booking processed successfully",
      });
    }
  } catch (error) {
    console.log("Error creating order:", error);
    // Trả về JSON cho lỗi
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the booking",
    });
  }
};

module.exports = {
  accessBookingbyUser,
};
