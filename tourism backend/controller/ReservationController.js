const pool = require("../dbConnection.js");
const checkTable = async () => {
  await pool.query(`create table if not exists reservation(
        reservation_id int auto_increment primary key,
        tourist_email varchar(30) not null,
        hotel_email varchar(30) not null,
        room_id int not null,
        status varchar(10) not null,
        foreign key (room_id) references room(room_id),
        foreign key(tourist_email) references user(email),
        foreign key(hotel_email) references user(email));`);
};

const getReservationData = async (req, res) => {
  await checkTable();
  console.log(req.body);
  pool.query(
    `select res.reservation_id,res.status,r.type,u.first_name,u.phone from reservation res join room r on res.room_id=r.room_id join user u on res.tourist_email=u.email where res.hotel_email = ?;`,
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
const updateReservationData = async (req, res) => {
  await checkTable();
  console.log(req.body);
  pool.query(
    `update reservation set status = ? where reservation_id=?`,
    [req.body.status, req.body.reservation_id],
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
const deleteReservationData = async (req, res) => {
  await checkTable();
  pool.query(
    `delete from reservation where reservation_id in (?);`,
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
module.exports = {
  getReservationData,
  updateReservationData,
  deleteReservationData,
};
