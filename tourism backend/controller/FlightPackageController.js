const pool = require("../dbConnection.js");
const moment = require("moment");

const guideRentalPackageController = require("./GuideRentalPackageController.js");
const hotelPackageController = require("./HotelPackageController.js");
const FlightPackageCheckTable = async () => {
  await pool.query(`create table if not exists flight_package(
        package_id int auto_increment not null primary key,  
        tourist_email varchar(30) not null,
        current_country varchar(30) not null,
        current_city varchar(30) not null,
        package_country varchar(30) not null,
        flight_id int not null,
        return_flight_id int,
        status varchar(20));`);
};
const insertPackage = async (req, res) => {
  await FlightPackageCheckTable();

  await hotelPackageController.HotelPackageCheckTable();
  await guideRentalPackageController.GuideRentalPackageCheckTable();
  // console.log("req.body:", req.body);
  // console.log(
  //   "req.body keys:",
  //   Object.keys(req.body.dataObject.Karachi.room_packages)
  // );
  // for (const city in req.body.dataObject) {
  //   console.log("city:", city);
  //   console.log("city object:", req.body.dataObject[city]);
  // }

  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Error getting connection:", err);
      return res
        .status(500)
        .json({ code: 500, error: "Database connection error" });
    }

    try {
      await new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      // await new Promise((resolve, reject) => {
      //   connection.query(
      //     `insert into flight_package(tourist_email,current_country,
      //     current_city,package_country,flight_id,return_flight_id,status) values(?,?,?,?,?,?,?)`,
      //     [
      //       req.body.email,
      //       req.body.departureCountry,
      //       req.body.departureCity,
      //       req.body.arrivalCountry,
      //       req.body.flightID,
      //       req.body.returnFlightID,
      //       "pending",
      //     ],
      //     (err, results) => {
      //       if (err) {
      //         reject(err);
      //       } else {
      //         resolve(results);
      //       }
      //     }
      //   );
      // });
      const rows = await new Promise((resolve, reject) => {
        connection.query("SELECT LAST_INSERT_ID();", (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      if (rows.length > 0) {
        const package_id = rows[0]["LAST_INSERT_ID()"];
        console.log("Package_id:", package_id);
      } else {
        console.log("No last inserted ID found.");
      }

      const temp_email = await new Promise((resolve, reject) => {
        connection.query(
          "SELECT email FROM flight WHERE flight_id = ?",
          [req.body.flightID],
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });

      if (temp_email.length > 0) {
        const airline_email = temp_email[0].email;
        console.log("airline email:", airline_email);
      } else {
        console.log("airline email not found.");
      }
      const temp_price = await new Promise((resolve, reject) => {
        connection.query(
          "SELECT price FROM flight WHERE flight_id = ?",
          [req.body.flightID],
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });

      if (temp_price.length > 0) {
        const airline_price = temp_price[0].price;
        console.log("airline price:", airline_price);
      } else {
        console.log("airline price not found.");
      }
      // await new Promise((resolve, reject) => {
      //   connection.query(
      //     `insert into flight_reservation(tourist_email,airline_email,status,seats_booked,flight_id,price) values(?,?,?,?,?,?)`,
      //     [req.body.email,airline_email,"pending",req.body.quantity,req.body.flightID,airline_price],
      //     (err, results) => {
      //       if (err) {
      //         reject(err);
      //       } else {
      //         resolve(results);
      //       }
      //     }
      //   );
      // });

      //  await new Promise((resolve, reject) => {
      //    connection.query(
      //      `update flight set seats_available=seats_available-? where flight_id=?`,
      //      [
      //        req.body.quantity,
      //        req.body.flightID,
      //        ],
      //      (err, results) => {
      //        if (err) {
      //          reject(err);
      //        } else {
      //          resolve(results);
      //        }
      //      }
      //    );
      //  });
      if (req.body.returnFlightID) {
        const temp_email = await new Promise((resolve, reject) => {
          connection.query(
            "SELECT email FROM flight WHERE flight_id = ?",
            [req.body.returnFlightID],
            (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve(results);
              }
            }
          );
        });

        if (temp_email.length > 0) {
          const return_airline_email = temp_email[0].email;
          console.log("return airline email:", return_airline_email);
        } else {
          console.log("airline email not found.");
        }
        const temp_price = await new Promise((resolve, reject) => {
          connection.query(
            "SELECT price FROM flight WHERE flight_id = ?",
            [req.body.returnFlightID],
            (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve(results);
              }
            }
          );
        });

        if (temp_price.length > 0) {
          const return_airline_price = temp_price[0].price;
          console.log("return airline price:", return_airline_price);
        } else {
          console.log("airline price not found.");
        }

        //  await new Promise((resolve, reject) => {
        //    connection.query(
        //      `insert into flight_reservation(tourist_email,airline_email,status,seats_booked,flight_id,price) values(?,?,?,?,?,?)`,
        //      [
        //        req.body.email,
        //        return_airline_email,
        //        "pending",
        //        req.body.quantity,
        //        req.body.returnFlightID,
        //        return_airline_price,
        //      ],
        //      (err, results) => {
        //        if (err) {
        //          reject(err);
        //        } else {
        //          resolve(results);
        //        }
        //      }
        //    );
        //  });

        // await new Promise((resolve, reject) => {
        //    connection.query(
        //      `update flight set seats_available=seats_available-? where flight_id=?`,
        //      [
        //        req.body.quantity,
        //        req.body.flightID,
        //        ],
        //      (err, results) => {
        //        if (err) {
        //          reject(err);
        //        } else {
        //          resolve(results);
        //        }
        //      }
        //    );
        //  });
      }
      const dates = await new Promise((resolve, reject) => {
        connection.query(
          "SELECT departure_date FROM flight WHERE flight_id = ?",
          [req.body.flightID],
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });

      let start_date = null;
      if (dates.length > 0) {
        start_date = dates[0].departure_date;
        console.log("Start Date:", start_date);
      } else {
        console.log("Start Date not found.");
      }
      const dataObj = req.body.dataObject;
      for (const city in dataObj) {
        const cityObj = dataObj[city];
        const daysStay = cityObj.days;

        const temp_date = moment(start_date, "YYYY-MM-DD").add(
          daysStay,
          "days"
        );
        const end_date = temp_date.format("YYYY-MM-DD");
        console.log("end date:", end_date);

        start_date = end_date;
      }
      await new Promise((resolve, reject) => {
        connection.commit((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      console.log("Transaction committed successfully.");
      res.json({
        code: 200,
        message: "Transaction successful",
      });
    } catch (error) {
      if (connection) {
        connection.rollback(() => {
          console.error("Transaction rolled back:", error);
          res.status(500).json({
            code: 500,
            error: "Transaction failed",
            details: error.message,
          });
        });
      } else {
        res.status(500).json({
          code: 500,
          error: "Transaction failed",
          details: error.message,
        });
      }
    } finally {
      if (connection) {
        connection.release();
      }
    }
  });
};
module.exports = { insertPackage };
