const router = require("express").Router();

const {
  handleGetUser,
  handleUpdateUser,
  deleteUser,
  getAllUsers
} = require("../controllers/user.controller");

const {verifyToken, verifyTokenWithAdmin} = require("../middleware/authMiddleware");

//get All
router.get("/", getAllUsers);

//get
router.get("/:id", handleGetUser);

//update
router.put("/:id", handleUpdateUser);

//delete
router.delete("/:id", deleteUser);

module.exports = router;
