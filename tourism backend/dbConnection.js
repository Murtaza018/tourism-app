const { createPool } = require("mysql");
const pool = createPool({
  host: "localhost",
  password: "",
  user: "root",
  port: 3306,
  database: "tourism",
  dateStrings: true,
});

module.exports = pool;
