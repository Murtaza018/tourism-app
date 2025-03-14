const pool = require("../dbConnection.js");
const guideReservationCheckTable = async () => {
  await pool.query(`create table if not exists guide_reservation(
        reservation_id int auto_increment primary key,
        tourist_email varchar(30) not null,
        guide_email varchar(30) not null,
        start_date date not null,
        end_date date not null,
        status varchar(10) not null,
        foreign key(tourist_email) references user(email),
        foreign key(guide_email) references user(email) on delete cascade);`);
};

const getGuideReservationData = async (req, res) => {
  await guideReservationCheckTable();
  pool.query(
    `SELECT res.reservation_id, res.status, res.start_date, res.end_date, res.tourist_email,u.first_name, u.phone 
     FROM guide_reservation res
     JOIN user u ON res.tourist_email = u.email 
     WHERE res.guide_email = ?;`,
    [req.body.email],
    (err, results) => {
      if (err) {
        return res.status(500).json({ code: 500, data: err.message });
      }

      if (results) {
        const formattedResults = results.map((row) => ({
          ...row,
          start_date: row.start_date
            ? row.start_date.toISOString().slice(0, 10)
            : null,
          end_date: row.end_date
            ? row.end_date.toISOString().slice(0, 10)
            : null,
        }));

        return res.json({ code: 200, data: formattedResults });
      } else {
        return res.status(404).json({ code: 404, data: "No results found" });
      }
    }
  );
};
const updateGuideReservationData = async (req, res) => {
  await guideReservationCheckTable();
  console.log(req.body);
  pool.query(
    `update guide_reservation set status = ? where reservation_id=?`,
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
const deleteGuideReservationData = async (req, res) => {
  await guideReservationCheckTable();
  pool.query(
    `delete from guide_reservation where reservation_id in (?);`,
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
const CheckGuideReservationCount = async (req, res) => {
  await guideReservationCheckTable();
  pool.query(
    `select count(reservation_id) as res_count from guide_reservation where guide_email=? and status="pending";`,
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
  getGuideReservationData,
  updateGuideReservationData,
  deleteGuideReservationData,
  CheckGuideReservationCount,
  guideReservationCheckTable,
};
