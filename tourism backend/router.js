const userController = require("./controller/UserController.js");
const roomController = require("./controller/RoomController.js");
const express = require("express");
const router = express.Router();

router.post("/insertUser", userController.insertUser);
router.post("/signInUser", userController.signInUser);

router.post("/insertRoom", roomController.insertRoom);
router.post("/getRoomData", roomController.getRoomData);
router.post("/DeleteRoom", roomController.DeleteRoom);
router.post("/updateRoom", roomController.UpdateRoom);

module.exports = router;
