const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./router.js");
app.use(cors());
app.use(express.json());
app.use("/Tourism", router);
app.listen(8008, () => {
  console.log("Hello World!");
});
