const pool = require("../dbConnection.js");
const checkTable = async () => {
  await pool.query(`create table if not exists room(
        room_id int auto_increment primary key,
        email varchar(30) not null,
        type varchar(20) not null,
        quantity int not null,
        price float not null,
        status varchar(20) not null,
        foreign key (email) references user(email));`);
};
const insertRoom = async (req, res) => {
  await checkTable();
  console.log(req.body);
  pool.query(
    `insert into room(email,type,quantity,price,status) values(?,?,?,?,?);`,
    [
      req.body.email,
      req.body.type,
      req.body.quantity,
      req.body.price,
      req.body.status,
    ],
    (err, results) => {
      if (err) {
        res.json({ code: 500, data: err });
      } else {
        return res.json({ code: 200, data: "user created" });
      }
    }
  );
};
const getRoomData = async (req, res) => {
  await checkTable();
  console.log(req.body);
  pool.query(
    `select * from room where email = ?;`,
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

module.exports = { insertRoom, getRoomData };
