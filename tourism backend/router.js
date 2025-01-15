const userController = require("./controller/UserController.js");
const express = require("express");
const router = express.Router();

router.post("/insertUser", userController.insertUser);
router.post("/signInUser", userController.signInUser);

module.exports = router;
