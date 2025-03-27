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
        start_date date default null,
        end_date date default null,
        quantity int not null,
        status varchar(20));`);
};
const insertPackage = async (req, res) => {
  await FlightPackageCheckTable();

  await hotelPackageController.HotelPackageCheckTable();
  await guideRentalPackageController.GuideRentalPackageCheckTable();
  console.log("req.body:", req.body);
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
      await new Promise((resolve, reject) => {
        connection.query(
          `insert into flight_package(tourist_email,current_country,
          current_city,package_country,flight_id,return_flight_id,status,quantity) values(?,?,?,?,?,?,?,?)`,
          [
            req.body.email,
            req.body.departureCountry,
            req.body.departureCity,
            req.body.arrivalCountry,
            req.body.flightID,
            req.body.returnFlightID,
            "pending",
            req.body.quantity,
          ],
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });
      const rows = await new Promise((resolve, reject) => {
        connection.query("SELECT LAST_INSERT_ID();", (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
      let package_id = null;
      if (rows.length > 0) {
        package_id = rows[0]["LAST_INSERT_ID()"];
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
      let airline_email = null;
      let airline_price = null;
      if (flightData.length > 0) {
        airline_email = flightData[0].email;
        airline_price = flightData[0].price;
        console.log("airline email:", airline_email);
        console.log("airline price:", airline_price);
      } else {
        console.log("Airline email and price not found.");
      }
      await new Promise((resolve, reject) => {
        connection.query(
          `insert into flight_reservation(tourist_email,airline_email,status,seats_booked,flight_id,price) values(?,?,?,?,?,?)`,
          [
            req.body.email,
            airline_email,
            "pending",
            req.body.quantity,
            req.body.flightID,
            airline_price,
          ],
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });

      await new Promise((resolve, reject) => {
        connection.query(
          `update flight set seats_available=seats_available-? where flight_id=?`,
          [req.body.quantity, req.body.flightID],
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });
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
        let return_airline_email = null;
        let return_airline_price = null;
        if (flightData.length > 0) {
          return_airline_email = flightData[0].email;
          return_airline_price = flightData[0].price;
          console.log("return airline email:", return_airline_email);
          console.log("return airline price:", return_airline_price);
        } else {
          console.log("Airline email and price not found.");
        }

        await new Promise((resolve, reject) => {
          connection.query(
            `insert into flight_reservation(tourist_email,airline_email,status,seats_booked,flight_id,price) values(?,?,?,?,?,?)`,
            [
              req.body.email,
              return_airline_email,
              "pending",
              req.body.quantity,
              req.body.returnFlightID,
              return_airline_price,
            ],
            (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve(results);
              }
            }
          );
        });

        await new Promise((resolve, reject) => {
          connection.query(
            `update flight set seats_available=seats_available-? where flight_id=?`,
            [req.body.quantity, req.body.returnFlightID],
            (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve(results);
              }
            }
          );
        });
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
      await new Promise((resolve, reject) => {
        connection.query(
          `update flight_package set start_date=? where package_id=?`,
          [start_date, package_id],
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });
      const dataObj = req.body.dataObject;
      let end_date = null;
      for (const city in dataObj) {
        const cityObj = dataObj[city];
        const daysStay = cityObj.days;
        const temp_date = moment(start_date, "YYYY-MM-DD").add(
          daysStay,
          "days"
        );
        end_date = temp_date.format("YYYY-MM-DD");
        console.log("end date:", end_date);

        let package_guide_email = null;
        if (cityObj.guide_email === "") {
          package_guide_email = null;
        } else {
          package_guide_email = cityObj.guide_email;
        }
        let guide_res_id = null;

        if (package_guide_email !== null) {
          await new Promise((resolve, reject) => {
            connection.query(
              `insert into guide_reservation(tourist_email,guide_email,start_date,end_date,status,price)
            values(?,?,?,?,"pending",?);`,
              [
                req.body.email,
                package_guide_email,
                start_date,
                end_date,
                cityObj.guide_price,
              ],
              (err, results) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(results);
                }
              }
            );
          });
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
            guide_res_id = rows2[0]["LAST_INSERT_ID()"];
            console.log("guide_res_id:", guide_res_id);
          } else {
            console.log("No last inserted ID found.");
          }
        }
        let package_rental_email = null;
        if (cityObj.rental_email === "") {
          package_rental_email = null;
        } else {
          package_rental_email = cityObj.rental_email;
        }
        let rental_res_id = null;

        if (package_rental_email !== null) {
          await new Promise((resolve, reject) => {
            connection.query(
              `insert into guide_reservation(tourist_email,guide_email,start_date,end_date,status,price)
            values(?,?,?,?,"pending",?);`,
              [
                req.body.email,
                package_rental_email,
                start_date,
                end_date,
                cityObj.rental_price,
              ],
              (err, results) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(results);
                }
              }
            );
          });
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
            rental_res_id = rows3[0]["LAST_INSERT_ID()"];
            console.log("rental_res_id:", rental_res_id);
          } else {
            console.log("No last inserted ID found.");
          }
        }
        await new Promise((resolve, reject) => {
          connection.query(
            `insert into guide_rental_package(package_id,city,guide_email,guide_reservation_id,rental_email,rental_reservation_id,days_stay)
            values(?,?,?,?,?,?,?);`,
            [
              package_id,
              city,
              package_guide_email,
              guide_res_id,
              package_rental_email,
              rental_res_id,
              daysStay,
            ],
            (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve(results);
              }
            }
          );
        });

        const temp_room_ids = Object.keys(cityObj.room_packages);
        const room_ids = temp_room_ids.map((key) => parseInt(key, 10));
        console.log(`room keys in ${city}:`, room_ids);

        for (const i in room_ids) {
          console.log("working on room ID:", room_ids[i]);
          const room_price = cityObj.room_packages[room_ids[i].toString()];

          console.log("room ID price:", room_price);
          await new Promise((resolve, reject) => {
            connection.query(
              `insert into reservation(tourist_email,hotel_email,room_id,status,start_date,end_date,price)
              values(?,?,?,"pending",?,?,?);`,
              [
                req.body.email,
                cityObj.email,
                room_ids[i],
                start_date,
                end_date,
                room_price,
              ],
              (err, results) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(results);
                }
              }
            );
          });

          const rows4 = await new Promise((resolve, reject) => {
            connection.query("SELECT LAST_INSERT_ID();", (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve(results);
              }
            });
          });
          let hotel_res_id = null;
          if (rows4.length > 0) {
            hotel_res_id = rows4[0]["LAST_INSERT_ID()"];
            console.log("hotel_res_id:", hotel_res_id);
          } else {
            console.log("No last inserted ID found.");
          }
          await new Promise((resolve, reject) => {
            connection.query(
              `insert into hotel_package(package_id,city,hotel_email,room_id,reservation_id,days_stay)
              values(?,?,?,?,?,?);`,
              [
                package_id,
                city,
                cityObj.email,
                room_ids[i],
                hotel_res_id,
                daysStay,
              ],
              (err, results) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(results);
                }
              }
            );
          });
        }

        start_date = end_date;
      }
      await new Promise((resolve, reject) => {
        connection.query(
          `update flight_package set end_date=? where package_id=?`,
          [end_date, package_id],
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });
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
const getPackage = async (req, res) => {
  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Error getting connection:", err);
      return res
        .status(500)
        .json({ code: 500, error: "Database connection error" });
    }

    try {
      const email = req.body.email;

      const flightPackageQuery = `
        SELECT
          fp.*,
          f1.price AS flight_price,
          f2.price AS return_flight_price,
          u1.first_name AS airline_first_name,
          u1.last_name AS airline_last_name,
          u2.first_name AS return_airline_first_name,
          u2.last_name AS return_airline_last_name,
          fp.start_date,
          fp.end_date,
          fp.status
        FROM
          flight_package fp
        LEFT JOIN
          flight f1 ON fp.flight_id = f1.flight_id
        LEFT JOIN
          flight f2 ON fp.return_flight_id = f2.flight_id
        LEFT JOIN
          user u1 ON f1.email = u1.email
        LEFT JOIN
          user u2 ON f2.email = u2.email
        WHERE
          fp.tourist_email = ?;
      `;

      const flightPackageResults = await new Promise((resolve, reject) => {
        connection.query(flightPackageQuery, [email], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      if (flightPackageResults.length === 0) {
        connection.release();
        console.log("no package found");
        return res
          .status(404)
          .json({ code: 404, message: "No packages found for this email" });
      }

      const packages = [];

      for (const packageRow of flightPackageResults) {
        const package_id = packageRow.package_id;

        const guideRentalQuery = `
          SELECT
            grp.*,
            u1.first_name AS guide_first_name,
            u1.last_name AS guide_last_name,
            u2.first_name AS rental_first_name,
            u2.last_name AS rental_last_name
          FROM
            guide_rental_package grp
          LEFT JOIN
            user u1 ON grp.guide_email = u1.email
          LEFT JOIN
            user u2 ON grp.rental_email = u2.email
          WHERE
            grp.package_id = ?;
        `;

        const guideRentalResults = await new Promise((resolve, reject) => {
          connection.query(guideRentalQuery, [package_id], (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });

        const hotelPackageQuery = `
          SELECT
            hp.*,
            r.price AS room_price,
            u.first_name,
            u.last_name,
            room.type AS room_type,
            r.room_id AS room_id
          FROM
            hotel_package hp
          LEFT JOIN
            reservation r ON hp.reservation_id = r.reservation_id
          LEFT JOIN
            user u ON hp.hotel_email = u.email
          LEFT JOIN
            room ON r.room_id = room.room_id
          WHERE
            hp.package_id = ?;
        `;

        const hotelPackageResults = await new Promise((resolve, reject) => {
          connection.query(hotelPackageQuery, [package_id], (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });

        const packageObj = {
          package_id: package_id,
          dataObject: {},
          quantity: packageRow.quantity,
          flightID: packageRow.flight_id,
          returnFlightID: packageRow.return_flight_id,
          departureCountry: packageRow.current_country,
          departureCity: packageRow.current_city,
          arrivalCountry: packageRow.package_country,
          flight_price: packageRow.flight_price,
          return_flight_price: packageRow.return_flight_price,
          airline_first_name: packageRow.airline_first_name,
          airline_last_name: packageRow.airline_last_name,
          return_airline_first_name: packageRow.return_airline_first_name,
          return_airline_last_name: packageRow.return_airline_last_name,
          start_date: packageRow.start_date,
          end_date: packageRow.end_date,
          status: packageRow.status,
        };

        for (const cityData of guideRentalResults) {
          const city = cityData.city;
          packageObj.dataObject[city] = {
            days: cityData.days_stay.toString(),
            email: cityData.hotel_email,
            first_name: "",
            last_name: "",
            room_packages: {},
            room_types: {},
            guide_email: cityData.guide_email,
            guide_first_name: cityData.guide_first_name,
            guide_last_name: cityData.guide_last_name,
            guide_price: cityData.price,
            rental_email: cityData.rental_email,
            rental_first_name: cityData.rental_first_name,
            rental_last_name: cityData.rental_last_name,
            rental_price: cityData.price,
          };
        }

        for (const hotelData of hotelPackageResults) {
          const city = hotelData.city;
          if (packageObj.dataObject[city]) {
            packageObj.dataObject[city].email = hotelData.hotel_email;
            packageObj.dataObject[city].first_name = hotelData.first_name;
            packageObj.dataObject[city].last_name = hotelData.last_name;
            packageObj.dataObject[city].room_packages[hotelData.room_id] =
              hotelData.room_price;
            packageObj.dataObject[city].room_types[hotelData.room_id] =
              hotelData.room_type;
          }
        }

        packages.push(packageObj);
      }

      connection.release();
      console.log("package data:", packages);
      res.json({ code: 200, packages: packages });
    } catch (error) {
      if (connection) {
        connection.release();
      }
      console.error("Error fetching packages:", error);
      res.status(500).json({
        code: 500,
        error: "Error fetching packages",
        details: error.message,
      });
    }
  });
};
module.exports = { insertPackage, getPackage };
