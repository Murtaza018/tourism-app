const pool = require("../dbConnection.js");
const FlightReservationCheckTable = async () => {
  await pool.query(`create table if not exists flight_reservation(
        reservation_id int auto_increment primary key,
        tourist_email varchar(30) not null,
        airline_email varchar(30) not null,
        status varchar(10) not null,
        seats_booked int not null,
        flight_id int not null,
        foreign key (flight_id) references flight(flight_id),
        foreign key(tourist_email) references user(email),
        foreign key(airline_email) references user(email) on delete cascade);`);
};

const getFlightReservationData = async (req, res) => {
  await FlightReservationCheckTable();
  console.log(req.body);
  pool.query(
    `select res.reservation_id,res.seats_booked,res.status,f.flight_name,f.seat_type,u.first_name,u.phone from flight_reservation res join flight f 
    on res.flight_id=f.flight_id join user u on res.tourist_email=u.email where res.airline_email = ?;`,
    [req.body.email],
    (err, results) => {
      console.log(results);
      if (results) {
        console.log("Hi", results);
        return res.json({ code: 200, data: results });
      } else {
        res.json({ code: 500, data: err });
      }
    }
  );
};
const updateFlightReservationData = async (req, res) => {
  await FlightReservationCheckTable();
  console.log(req.body);
  pool.query(
    `update flight_reservation set status = ? where reservation_id=?`,
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
const deleteFlightReservationData = async (req, res) => {
  await FlightReservationCheckTable();
  pool.query(
    `delete from flight_reservation where reservation_id in (?);`,
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
const CheckFlightReservationCount = async (req, res) => {
  await FlightReservationCheckTable();
  pool.query(
    `select count(reservation_id) as res_count from flight_reservation where airline_email=? and status="pending";`,
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
  FlightReservationCheckTable,
  getFlightReservationData,
  updateFlightReservationData,
  deleteFlightReservationData,
  CheckFlightReservationCount,
};
