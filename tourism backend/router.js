const userController = require("./controller/UserController.js");
const roomController = require("./controller/RoomController.js");
const reservationController = require("./controller/ReservationController.js");
const flightReservationController = require("./controller/FlightReservationController.js");
const accountStatusController = require("./controller/StatusController.js");
const flightController = require("./controller/FlightController.js");
const feedbackController = require("./controller/FeedbackController.js");
const guideReservationController = require("./controller/GuideReservationController.js");
const priceController = require("./controller/PriceController.js");
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
router.post("/getFlightData", flightController.getFlightData);
router.post("/updateFlight", flightController.UpdateFlight);
router.post("/DeleteFlight", flightController.DeleteFlight);

router.post(
  "/getFlightReservationData",
  flightReservationController.getFlightReservationData
);
router.post(
  "/updateFlightReservationData",
  flightReservationController.updateFlightReservationData
);
router.post(
  "/deleteFlightReservationData",
  flightReservationController.deleteFlightReservationData
);
router.post(
  "/CheckFlightReservationCount",
  flightReservationController.CheckFlightReservationCount
);

router.post("/getFeedbackData", feedbackController.getFeedbackData);
router.post("/SubmitFeedback", feedbackController.insertFeedback);

router.post(
  "/getGuideReservationData",
  guideReservationController.getGuideReservationData
);
router.post(
  "/updateGuideReservationData",
  guideReservationController.updateGuideReservationData
);
router.post(
  "/deleteGuideReservationData",
  guideReservationController.deleteGuideReservationData
);
router.post(
  "/CheckGuideReservationCount",
  guideReservationController.CheckGuideReservationCount
);

router.post("/getPrice", priceController.getPrice);

module.exports = router;
