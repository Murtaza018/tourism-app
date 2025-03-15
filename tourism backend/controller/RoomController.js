const pool = require("../dbConnection.js");
const RoomCheckTable = async () => {
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
  await RoomCheckTable();
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
  await RoomCheckTable();
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
const DeleteRoom = async (req, res) => {
  await RoomCheckTable();
  pool.query(
    `delete from room where room_id in (?);`,
    [req.body],
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
const UpdateRoom = async (req, res) => {
  await RoomCheckTable();
  pool.query(
    `update room set type=?,quantity=?,price=?,status=? where room_id = (?);`,
    [
      req.body.type,
      req.body.quantity,
      req.body.price,
      req.body.status,
      req.body.room_id,
    ],
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
const getPackageRoomData = async (req, res) => {
  console.log("req.body;", req.body);
  await RoomCheckTable();
  pool.query(
    `SELECT *
FROM room
WHERE email = ?
  AND room_id NOT IN (
    SELECT room_id
    FROM reservation
    WHERE start_date < ?
      AND end_date > ?
  );`,
    [req.body.email, req.body.end_date, req.body.start_date],
    (err, results) => {
      if (results) {
        return res.json({ code: 200, data: results });
      } else {
        res.json({ code: 500, data: err });
      }
    }
  );
};
module.exports = {
  insertRoom,
  getRoomData,
  DeleteRoom,
  UpdateRoom,
  RoomCheckTable,
  getPackageRoomData,
};
