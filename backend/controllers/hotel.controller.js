const Hotel = require("../models/hotel.js");

const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};
const updateHotel = async (req, res, next) => {
  try {
    // Using findByIdAndUpdate to find the hotel by its ID and update its fields
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id, // req.params.id contains the ID of the hotel to be updated
      { $set: req.body }, // Updating the hotel fields with the data from req.body
      { new: true } // { new: true } returns the updated document after the update operation
    );

    // Sending the updated hotel as a JSON response
    res.status(200).json(updatedHotel);
  } catch (err) {
    // Handling any errors that might occur during the update process
    next(err);
  }
};

const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been delete");
  } catch (err) {
    next(err);
  }
};

const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

//  const getHotels = async (req, res, next) => {
//   const { min, max, ...others } = req.query;
//   try {
//     const hotels = await Hotel.find({
//       ...others,
//       cheapestPrice: { $gt: min || 1, $lt: max || 999 },
//     }).limit(req.query.limit);
//     res.status(200).json(hotels);
//   } catch (err) {
//     next(err);
//   }
// };

// const getHotels = async (req, res, next) => {
//   const { min, max, limit, ...others } = req.query;

//   try {
//     // Parse the limit parameter to ensure it's an integer
//     const limitValue = limit ? parseInt(limit, 10) : undefined;

//     const hotels = await Hotel.find({
//       ...others,
//       price: { $gt: min || 1, $lt: max || 9999999 },
//     }).limit(limitValue);

//     res.status(200).json(hotels);
//   } catch (err) {
//     next(err);
//   }
// };
const getHotels = async (req, res, next) => {
  const { min, max, page, limit, ...others } = req.query;

  try {
    const limitValue = limit && parseInt(limit, 10);
    const pageValue = page && parseInt(page, 10);

    const skip = (pageValue - 1) * limitValue;

    const hotels = await Hotel.find({
      ...others,
      price: { $gt: min || 1, $lt: max || 9999999 },
    })
      .skip(skip)
      .limit(limitValue);

    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

const countByCity = async (req, res, next) => {
  const cities = req.query.cities ? req.query.cities.split(",") : [];

  try {
    // If no city is provided, fetch all hotels
    if (cities.length === 0) {
      const totalCount = await Hotel.countDocuments({});
      res.status(200).json(totalCount);
    } else {
      // Otherwise, fetch hotels based on the provided cities
      const list = await Promise.all(
        cities.map((city) => {
          return Hotel.countDocuments({
            city: { $regex: city, $options: "i" },
          });
        })
      );
      res.status(200).json(list);
    }
  } catch (error) {
    next(error);
  }
};

const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

const getHotelById = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Lấy userId từ request parameters
    const hotels = await Hotel.find({ userId: userId });
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createHotel,
  deleteHotel,
  getHotel,
  getHotels,
  updateHotel,
  countByCity,
  countByType,
  getHotelRooms,
  getHotelById,
};
