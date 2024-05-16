const router = require("express").Router();
const {
  createHotel,
  deleteHotel,
  getHotel,
  getHotels,
  updateHotel,
  countByCity,
  countByType,
  getHotelRooms,
  getHotelById,
} = require("../controllers/hotel.controller.js");

//CREATE
router.post("/", createHotel);

//UPDATE
router.put("/:id", updateHotel);

//DELETE
router.delete("/:id", deleteHotel);
//GET
router.get("/:id", getHotel);
//GET ALL
router.get("/", getHotels);

router.get("/hotel-manager/:userId", getHotelById);

router.get("/", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);
module.exports = router;
