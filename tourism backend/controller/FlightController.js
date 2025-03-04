const pool = require("../dbConnection.js");
const FlightCheckTable = async () => {
  await pool.query(`create table if not exists flight(
        flight_id int auto_increment primary key,
        flight_name varchar(20) not null,
        seats_available int not null,
        seat_type varchar(20) not null,
        price float not null,
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
//hello
const insertFlight = async (req, res) => {
  console.log(req.body);
  await FlightCheckTable();
  pool.query(
    `
   insert into flight (
        email, departure_date, departure_time, departure_city, departure_country,
        arrival_date, arrival_time, arrival_city, arrival_country,flight_name,seats_available,seat_type,price
    ) values (?,?,?,?,?,?,?,?,?,?,?,?,?);
`,
    [
      req.body.email,
      req.body.departureDate,
      req.body.departureTime,
      req.body.selectedDepartureCity,
      req.body.selectedDepartureCountryName,
      req.body.arrivalDate,
      req.body.arrivalTime,
      req.body.selectedArrivalCity,
      req.body.selectedArrivalCountryName,
      req.body.flightName,
      req.body.seatsAvailable,
      req.body.seatType,
      req.body.price,
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
const getFlightData = async (req, res) => {
  await FlightCheckTable();
  pool.query(
    `select * from flight where email = ?;`,
    [req.body.email],
    (err, results) => {
      if (results) {
        const flights = results;

        const parsedFlights = flights.map((flight) => {
          const departureTime = flight.departure_time;

          let formattedDepartureTime = null;

          if (departureTime) {
            //Check if it is not null or undefined
            if (typeof departureTime === "string") {
              //Check if it is a string
              formattedDepartureTime = new Date(
                `1970-01-01T${departureTime}`
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              });
            } else if (departureTime instanceof Date) {
              //Check if it is a Date object
              formattedDepartureTime = departureTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              });
            } else {
              console.error(
                "Unexpected departure time type:",
                typeof departureTime,
                departureTime
              );
            }
          }
          return {
            ...flight,
            departure_date: flight.departure_date
              ? flight.departure_date.toISOString().split("T")[0]
              : null,
            departure_time: formattedDepartureTime, // Use the formatted time
            arrival_date: flight.arrival_date
              ? flight.arrival_date.toISOString().split("T")[0]
              : null,
            arrival_time: flight.arrival_time
              ? new Date(
                  `1970-01-01T${flight.arrival_time}`
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })
              : null,
          };
        });
        console.log(parsedFlights);
        return res.json({ code: 200, data: parsedFlights });
      } else {
        res.json({ code: 500, data: err });
      }
    }
  );
};
const DeleteFlight = async (req, res) => {
  await FlightCheckTable();
  pool.query(
    `delete from flight where flight_id in (?);`,
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
const UpdateFlight = async (req, res) => {
  await FlightCheckTable();
  pool.query(
    `update flight set departure_date=?,departure_time=?,arrival_date=?,arrival_time=?,seats_available=?,price=? where flight_id = (?);`,
    [
      req.body.departure_date,
      req.body.departure_time,
      req.body.arrival_date,
      req.body.arrival_time,
      req.body.seats_available,
      req.body.price,
      req.body.flight_id,
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
const getFlights = async (req, res) => {
  console.log(req.body);

  try {
    await FlightCheckTable();

    pool.query(
      `select * from flight where departure_date = ? and departure_country=? and departure_city=? and arrival_country=? and arrival_city=? and seats_available>?;`,
      [
        req.body.date,
        req.body.departure_country,
        req.body.departure_city,
        req.body.arrival_country,
        req.body.arrival_city,
        req.body.quantity,
      ],
      (err, results) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ code: 500, message: "Database error" });
        }

        const parsedFlights = results.map((flight) => ({
          ...flight,

          // No need to format departure_date or arrival_date
          departure_date: flight.departure_date, // Directly use the string value
          departure_time: flight.departure_time
            ? new Date(
                `1970-01-01T${flight.departure_time}`
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })
            : null,
          arrival_date: flight.arrival_date, // Directly use the string value
          arrival_time: flight.arrival_time
            ? new Date(`1970-01-01T${flight.arrival_time}`).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                }
              )
            : null,
        }));

        console.log(parsedFlights);
        return res.json({ code: 200, data: parsedFlights });
      }
    );
  } catch (error) {
    console.error("Error in getFlights:", error);
    return res
      .status(500)
      .json({ code: 500, message: "Internal server error" });
  }
};
module.exports = {
  insertFlight,
  getFlightData,
  UpdateFlight,
  DeleteFlight,
  getFlights,
};
