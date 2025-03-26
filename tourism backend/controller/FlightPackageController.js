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

      const flightData = await new Promise((resolve, reject) => {
        connection.query(
          "SELECT email, price FROM flight WHERE flight_id = ?",
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

      if (flightData.length > 0) {
        const airline_email = flightData[0].email;
        const airline_price = flightData[0].price;
        console.log("airline email:", airline_email);
        console.log("airline price:", airline_price);
      } else {
        console.log("Airline email and price not found.");
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
        const flightData = await new Promise((resolve, reject) => {
          connection.query(
            "SELECT email, price FROM flight WHERE flight_id = ?",
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

        if (flightData.length > 0) {
          const return_airline_email = flightData[0].email;
          const return_airline_price = flightData[0].price;
          console.log("return airline email:", return_airline_email);
          console.log("return airline price:", return_airline_price);
        } else {
          console.log("Airline email and price not found.");
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
        // await new Promise((resolve, reject) => {
        //   connection.query(
        //     `insert into guide_reservation(tourist_email,guide_email,start_date,end_date,status,price)
        //     values(?,?,?,?,"pending",?);`,
        //     [req.body.email,cityObj.guide_email,start_date,end_date,cityObj.guide_price],
        //     (err, results) => {
        //       if (err) {
        //         reject(err);
        //       } else {
        //         resolve(results);
        //       }
        //     }
        //   );
        // });
        const rows2 = await new Promise((resolve, reject) => {
          connection.query("SELECT LAST_INSERT_ID();", (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });

        if (rows2.length > 0) {
          const guide_res_id = rows2[0]["LAST_INSERT_ID()"];
          console.log("guide_res_id:", guide_res_id);
        } else {
          console.log("No last inserted ID found.");
        }
        // await new Promise((resolve, reject) => {
        //   connection.query(
        //     `insert into guide_reservation(tourist_email,guide_email,start_date,end_date,status,price)
        //     values(?,?,?,?,"pending",?);`,
        //     [req.body.email,cityObj.rental_email,start_date,end_date,cityObj.rental_price],
        //     (err, results) => {
        //       if (err) {
        //         reject(err);
        //       } else {
        //         resolve(results);
        //       }
        //     }
        //   );
        // });
        const rows3 = await new Promise((resolve, reject) => {
          connection.query("SELECT LAST_INSERT_ID();", (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });

        if (rows3.length > 0) {
          const rental_res_id = rows3[0]["LAST_INSERT_ID()"];
          console.log("rental_res_id:", rental_res_id);
        } else {
          console.log("No last inserted ID found.");
        }
        // await new Promise((resolve, reject) => {
        //   connection.query(
        //     `insert into guide_rental_package(package_id,city,guide_email,guide_reservation_id,rental_email,rental_reservation_id,days_stay)
        //     values(?,?,?,?,?,?,?);`,
        //     [package_id,city,cityObj.guide_email,guide_res_id,cityObj.rental_email,rental_res_id,daysStay],
        //     (err, results) => {
        //       if (err) {
        //         reject(err);
        //       } else {
        //         resolve(results);
        //       }
        //     }
        //   );
        // });

        const temp_room_ids = Object.keys(cityObj.room_packages);
        const room_ids = temp_room_ids.map((key) => parseInt(key, 10));
        console.log(`room keys in ${city}:`, room_ids);

        for (const i in room_ids) {
          console.log("working on room ID:", room_ids[i]);
          const room_price = cityObj.room_packages[room_ids[i].toString()];

          console.log("room ID price:", room_price);
          // await new Promise((resolve, reject) => {
          //   connection.query(
          //     `insert into reservation(tourist_email,hotel_email,room_id,status,start_date,end_date,price)
          //     values(?,?,?,"pending",?,?,?);`,
          //     [
          //       req.body.email,
          //       cityObj.email,
          //       room_ids[i],
          //       start_date,
          //       end_date,
          //       room_price,
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

          const rows4 = await new Promise((resolve, reject) => {
            connection.query("SELECT LAST_INSERT_ID();", (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve(results);
              }
            });
          });

          if (rows4.length > 0) {
            const hotel_res_id = rows4[0]["LAST_INSERT_ID()"];
            console.log("hotel_res_id:", hotel_res_id);
          } else {
            console.log("No last inserted ID found.");
          }
          // await new Promise((resolve, reject) => {
          //   connection.query(
          //     `insert into hotel_package(package_id,city,hotel_email,room_id,reservation_id,days_stay)
          //     values(?,?,?,?,?,?);`,
          //     [
          //       package_id,
          //       city,
          //       cityObj.email,
          //       room_ids[i],
          //       hotel_res_id,
          //       daysStay,
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
        }

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
