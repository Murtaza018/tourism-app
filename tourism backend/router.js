const userController = require("./controller/UserController.js");
const express = require("express");
const router = express.Router();

router.post("/insertUser", userController.insertUser);

module.exports = router;
