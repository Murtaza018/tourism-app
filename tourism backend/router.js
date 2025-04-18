const userController = require("./controller/UserController.js");
const roomController = require("./controller/RoomController.js");
const reservationController = require("./controller/ReservationController.js");
const flightReservationController = require("./controller/FlightReservationController.js");
const accountStatusController = require("./controller/StatusController.js");
const flightController = require("./controller/FlightController.js");
const feedbackController = require("./controller/FeedbackController.js");
const guideReservationController = require("./controller/GuideReservationController.js");
const priceController = require("./controller/PriceController.js");
const carController = require("./controller/CarController.js");
const flightPackageController = require("./controller/FlightPackageController.js");
const guideRentalPackageController = require("./controller/GuideRentalPackageController.js");
const express = require("express");
const router = express.Router();

router.post("/insertUser", userController.insertUser);
router.post("/signInUser", userController.signInUser);
router.post("/updateUser", userController.updateUser);
router.post("/UserDataRetreival", userController.UserDataRetreival);
router.post("/DeleteUser", userController.DeleteUser);
router.post("/getHotels", userController.getHotels);
router.post("/getGuides", userController.getGuides);
router.post("/getRentals", userController.getRentals);
router.post("/getAdminHotels", userController.getAdminHotels);
router.post("/getAdminAirlines", userController.getAdminAirlines);
router.post("/getAdminGuides", userController.getAdminGuides);
router.post("/getAdminRentals", userController.getAdminRentals);
router.post("/getAdminTourists", userController.getAdminTourists);

router.post("/insertRoom", roomController.insertRoom);
router.post("/getRoomData", roomController.getRoomData);
router.post("/DeleteRoom", roomController.DeleteRoom);
router.post("/updateRoom", roomController.UpdateRoom);
router.post("/getPackageRoomData", roomController.getPackageRoomData);

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
router.post(
  "/AdminUpdateAccountStatus",
  accountStatusController.AdminUpdateAccountStatus
);

router.post("/InsertFlight", flightController.insertFlight);
router.post("/getFlightData", flightController.getFlightData);
router.post("/updateFlight", flightController.UpdateFlight);
router.post("/DeleteFlight", flightController.DeleteFlight);
router.post("/getFlights", flightController.getFlights);
router.post("/getIndividualFlight", flightController.getIndividualFlight);

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
router.post("/updatePrice", priceController.updatePrice);
router.post("/insertPrice", priceController.insertPrice);

router.post("/insertCar", carController.insertCar);
router.post("/getCar", carController.getCar);
router.post("/updateCar", carController.updateCar);

router.post("/insertPackage", flightPackageController.insertPackage);
router.post("/getPackages", flightPackageController.getPackage);
router.post(
  "/insertPackageFlight",
  flightPackageController.insertPackageFlight
);
router.post("/CheckPackageCount", flightPackageController.CheckPackageCount);

router.post(
  "/insertPackageGuide",
  guideRentalPackageController.insertPackageGuide
);
router.post(
  "/insertPackageRental",
  guideRentalPackageController.insertPackageRental
);

module.exports = router;
