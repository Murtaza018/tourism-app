const userController = require("./controller/UserController.js");
const roomController = require("./controller/RoomController.js");
const reservationController = require("./controller/ReservationController.js");
const accountStatusController = require("./controller/StatusController.js");
const flightController = require("./controller/FlightController.js");
const express = require("express");
const router = express.Router();

router.post("/insertUser", userController.insertUser);
router.post("/signInUser", userController.signInUser);
router.post("/updateUser", userController.updateUser);
router.post("/UserDataRetreival", userController.UserDataRetreival);
router.post("/DeleteUser", userController.DeleteUser);

router.post("/insertRoom", roomController.insertRoom);
router.post("/getRoomData", roomController.getRoomData);
router.post("/DeleteRoom", roomController.DeleteRoom);
router.post("/updateRoom", roomController.UpdateRoom);

router.post("/getReservationData", reservationController.getReservationData);
router.post(
  "/updateReservationData",
  reservationController.updateReservationData
);
router.post(
  "/deleteReservationData",
  reservationController.deleteReservationData
);
router.post(
  "/CheckReservationCount",
  reservationController.CheckReservationCount
);

router.post(
  "/AccountStatusRetreival",
  accountStatusController.AccountStatusRetreival
);
router.post(
  "/UpdateAccountStatus",
  accountStatusController.UpdateAccountStatus
);

router.post("/InsertFlight", flightController.insertFlight);

module.exports = router;
