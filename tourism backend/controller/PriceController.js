const pool = require("../dbConnection.js");
const PriceCheckTable = async () => {
  await pool.query(`create table if not exists price(
        email varchar(30) not null,
        price_per_day float not null,
        foreign key (email) references user(email) on delete cascade);`);
};
const getPrice = async (req, res) => {
  await PriceCheckTable();
  pool.query(
    `select price_per_day from price where email = ?;`,
    [req.body.email],
    (err, results) => {
      if (results) {
        console.log("Hi", results);
        return res.json({ code: 200, data: results });
      } else {
        res.json({ code: 500, data: err });
      }
    }
  );
};
const updatePrice = async (req, res) => {
  await PriceCheckTable();
  pool.query(
    `update price set price_per_day=? where email=?;`,
    [req.body.price, req.body.email],
    (err, results) => {
      if (results) {
        console.log("Hi", results);
        return res.json({ code: 200, data: results });
      } else {
        res.json({ code: 500, data: err });
      }
    }
  );
};
module.exports = { getPrice, updatePrice };
