const pool = require("../dbConnection.js");
const ReservationCheckTable = async () => {
  await pool.query(`create table if not exists reservation(
        reservation_id int auto_increment primary key,
        tourist_email varchar(30) not null,
        hotel_email varchar(30) not null,
        room_id int not null,
        status varchar(10) not null,
        start_date date not null,
        end_date date not null,
        price float not null,
        foreign key (room_id) references room(room_id),
        foreign key(tourist_email) references user(email),
        foreign key(hotel_email) references user(email));`);
};

const getReservationData = async (req, res) => {
  await ReservationCheckTable();
  console.log(req.body);
  pool.query(
    `select res.tourist_email,res.reservation_id,res.status,res.start_date,res.end_date,r.type,u.first_name,u.phone from reservation res join room r on res.room_id=r.room_id join user u on res.tourist_email=u.email where res.hotel_email = ?;`,
    [req.body.email],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ code: 500, message: "Database error" });
      }

      if (results) {
        console.log("hotel res:", results);
        const parsedReservations = results.map((reservation) => ({
          ...reservation,
          start_date: reservation.start_date
            ? typeof reservation.start_date === "string"
              ? reservation.start_date // Already in YYYY-MM-DD format
              : reservation.start_date instanceof Date
              ? reservation.start_date.toISOString().split("T")[0]
              : null
            : null,
          end_date: reservation.end_date
            ? typeof reservation.end_date === "string"
              ? reservation.end_date // Already in YYYY-MM-DD format
              : reservation.end_date instanceof Date
              ? reservation.end_date.toISOString().split("T")[0]
              : null
            : null,
        }));

        console.log("Hi", parsedReservations);
        return res.json({ code: 200, data: parsedReservations });
      } else {
        res.json({ code: 500, data: err });
      }
    }
  );
};
const updateReservationData = async (req, res) => {
  await ReservationCheckTable();
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
  await ReservationCheckTable();
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
const CheckReservationCount = async (req, res) => {
  await ReservationCheckTable();
  pool.query(
    `select count(reservation_id) as res_count from reservation where hotel_email=? and (status="pending" or status="ongoing");`,
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
module.exports = {
  getReservationData,
  updateReservationData,
  deleteReservationData,
  CheckReservationCount,
  ReservationCheckTable,
};
