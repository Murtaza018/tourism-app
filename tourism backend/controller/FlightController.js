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

        const parsedFlights = flights.map((flight) => ({
          ...flight,
          departure_date: flight.departure_date
            ? typeof flight.departure_date === "string" &&
              flight.departure_date.includes("T")
              ? flight.departure_date.split("T")[0]
              : flight.departure_date instanceof Date
              ? flight.departure_date.toISOString().split("T")[0]
              : flight.departure_date // Assuming it's already in a desirable format if not the above
            : null,
          departure_time: flight.departure_time
            ? typeof flight.departure_time === "string"
              ? new Date(
                  `1970-01-01T${flight.departure_time}`
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })
              : flight.departure_time instanceof Date
              ? flight.departure_time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })
              : null
            : null,
          arrival_date: flight.arrival_date
            ? typeof flight.arrival_date === "string" &&
              flight.arrival_date.includes("T")
              ? flight.arrival_date.split("T")[0]
              : flight.arrival_date instanceof Date
              ? flight.arrival_date.toISOString().split("T")[0]
              : flight.arrival_date // Assuming it's already in a desirable format if not the above
            : null,
          arrival_time: flight.arrival_time
            ? typeof flight.arrival_time === "string"
              ? new Date(
                  `1970-01-01T${flight.arrival_time}`
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })
              : flight.arrival_time instanceof Date
              ? flight.arrival_time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })
              : null
            : null,
        }));
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
      `SELECT u.*,COALESCE((SELECT AVG(f.rating) FROM feedback f WHERE f.receiver_email = u.email),0) AS rating FROM flight u 
      LEFT JOIN accountStatus a ON u.email = a.email WHERE u.departure_date = ? AND u.departure_country = ? AND u.departure_city = ? 
      AND u.arrival_country = ? AND u.arrival_city = ? AND a.status=1 and seats_available>?;`,
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

const getIndividualFlight = async (req, res) => {
  console.log("hello flight:", req.body);
  await FlightCheckTable();
  pool.query(
    `SELECT departure_date, departure_time, departure_country, departure_city, arrival_date, arrival_time, arrival_country, arrival_city, flight_name, seat_type FROM flight WHERE flight_id = ?;`,
    [req.body.flight_id],
    (err, results) => {
      if (results && results.length > 0) {
        const flight = results[0];

        const formattedDepartureTime = flight.departure_time
          ? (typeof flight.departure_time === "string"
              ? new Date(`1970-01-01T${flight.departure_time}`)
              : flight.departure_time
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })
          : null;

        const formattedArrivalTime = flight.arrival_time
          ? (typeof flight.arrival_time === "string"
              ? new Date(`1970-01-01T${flight.arrival_time}`)
              : flight.arrival_time
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })
          : null;

        let departureDateISO = null;
        if (flight.departure_date) {
          if (typeof flight.departure_date === "string") {
            // Attempt to parse the string into a Date object
            const parsedDate = new Date(flight.departure_date);
            if (!isNaN(parsedDate)) {
              departureDateISO = parsedDate.toISOString().split("T")[0];
            } else {
              console.error("Invalid date string:", flight.departure_date);
              departureDateISO = null; // or handle the error appropriately
            }
          } else if (flight.departure_date instanceof Date) {
            // If it's already a Date object, use toISOString()
            departureDateISO = flight.departure_date
              .toISOString()
              .split("T")[0];
          }
        }

        let arrivalDateISO = null;
        if (flight.arrival_date) {
          if (typeof flight.arrival_date === "string") {
            const parsedArrivalDate = new Date(flight.arrival_date);
            if (!isNaN(parsedArrivalDate)) {
              arrivalDateISO = parsedArrivalDate.toISOString().split("T")[0];
            } else {
              console.error("Invalid date string:", flight.arrival_date);
              arrivalDateISO = null;
            }
          } else if (flight.arrival_date instanceof Date) {
            arrivalDateISO = flight.arrival_date.toISOString().split("T")[0];
          }
        }

        const parsedFlight = {
          departure_date: departureDateISO,
          departure_time: formattedDepartureTime,
          departure_country: flight.departure_country,
          departure_city: flight.departure_city,
          arrival_date: arrivalDateISO,
          arrival_time: formattedArrivalTime,
          arrival_country: flight.arrival_country,
          arrival_city: flight.arrival_city,
          flight_name: flight.flight_name,
          seat_type: flight.seat_type,
        };

        console.log("flight Data:", parsedFlight);
        return res.json({ code: 200, data: parsedFlight });
      } else {
        res.json({ code: 500, data: err || "No flight found." });
      }
    }
  );
};
module.exports = {
  insertFlight,
  getFlightData,
  UpdateFlight,
  DeleteFlight,
  getFlights,
  FlightCheckTable,
  getIndividualFlight,
};
