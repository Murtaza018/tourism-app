const pool = require("../dbConnection.js");
const FlightCheckTable = async () => {
  await pool.query(`create table if not exists flight(
        flight_id int auto_increment primary key,
        email varchar(30) not null,
        departure_country varchar(30) not null,
        departure_city varchar(30) not null,
        departure_date date not null,
        departure_time time not null,
        arrival_country varchar(30) not null,
        arrival_city varchar(30) not null,
        arrival_date date not null,
        arrival_time time not null,
        foreign key (email) references user(email) on delete cascade);`);
};
const insertFlight = async (req, res) => {
  console.log(req.body);
  await FlightCheckTable();
  pool.query(
    `
   insert into flight (
        email, departure_date, departure_time, departure_city, departure_country,
        arrival_date, arrival_time, arrival_city, arrival_country
    ) values (?,?,?,?,?,?,?,?,?);
`,
    [
      req.body.email,
      req.body.departureDate,
      req.body.departureTime + ":00",
      req.body.selectedDepartureCity,
      req.body.selectedDepartureCountryName,
      req.body.arrivalDate,
      req.body.arrivalTime + ":00",
      req.body.selectedArrivalCity,
      req.body.selectedArrivalCountryName,
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
module.exports = { insertFlight };
