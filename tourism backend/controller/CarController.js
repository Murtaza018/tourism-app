const pool = require("../dbConnection.js");
const CarCheckTable = async () => {
  await pool.query(`create table if not exists car(
        email varchar(30) not null,
        capacity int not null,
        description varchar(40) not null,
        plate varchar(20) not null,
        foreign key (email) references user(email) on delete cascade);`);
};

const insertCar = async (req, res) => {
  await CarCheckTable();
  pool.query(
    `insert into car(email,capacity,description,plate) values (?,?,?,?);`,
    [req.body.email, req.body.capacity, req.body.desc, req.body.plate],
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
const getCar = async (req, res) => {
  await CarCheckTable();
  pool.query(
    `select description,plate,capacity from car where email=?;`,
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
const updateCar = async (req, res) => {
  await CarCheckTable();
  pool.query(
    `update car set description=?,plate=?,capacity=? where email=?;`,
    [req.body.desc, req.body.plate, req.body.capacity, req.body.email],
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

module.exports = { insertCar, updateCar, getCar, CarCheckTable };
