const express = require("express");
const cors = require("cors");
const role_table = require("./controller/RoleController.js");
const app = express();
const router = require("./router.js");
app.use(cors());
app.use(express.json());
app.use("/Tourism", router);
app.listen(8008, () => {
  role_table.createAndPopulateRole();
  console.log("Hello World!");
});
