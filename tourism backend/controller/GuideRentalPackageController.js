const pool = require("../dbConnection.js");
const guideRentalReservationController = require("./GuideReservationController.js");
const GuideRentalPackageCheckTable = async () => {
  await pool.query(`create table if not exists guide_rental_package(
        package_id int not null,
        city varchar(30) not null,
        guide_email varchar(30),
        guide_reservation_id int,
        rental_email varchar(30),
        rental_reservation_id int,
        days_stay int not null,
        foreign key (package_id) references flight_package(package_id));`);
};
const insertPackageGuide = async (req, res) => {
  await guideRentalReservationController.guideReservationCheckTable();
  console.log("req.body:", req.body);

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
          `insert into guide_reservation(tourist_email,guide_email,status,start_date,end_date,price) values(?,?,"pending",?,?,?)`,
          [
            req.body.email,
            req.body.guide_email,
            req.body.start_date,
            req.body.end_date,
            req.body.price,
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
      let guide_res_id = null;
      if (rows.length > 0) {
        guide_res_id = rows[0]["LAST_INSERT_ID()"];
        console.log("Package_id:", guide_res_id);
      } else {
        console.log("No last inserted ID found.");
      }
      await new Promise((resolve, reject) => {
        connection.query(
          `update guide_rental_package set guide_email=?,guide_reservation_id=? where package_id=? and city=?`,
          [
            req.body.guide_email,
            guide_res_id,
            req.body.package_id,
            req.body.city,
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
const insertPackageRental = async (req, res) => {
  await guideRentalReservationController.guideReservationCheckTable();
  console.log("req.body:", req.body);

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
          `insert into guide_reservation(tourist_email,guide_email,status,start_date,end_date,price) values(?,?,"pending",?,?,?)`,
          [
            req.body.email,
            req.body.rental_email,
            req.body.start_date,
            req.body.end_date,
            req.body.price,
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
      let rental_res_id = null;
      if (rows.length > 0) {
        rental_res_id = rows[0]["LAST_INSERT_ID()"];
        console.log("Package_id:", rental_res_id);
      } else {
        console.log("No last inserted ID found.");
      }
      await new Promise((resolve, reject) => {
        connection.query(
          `update guide_rental_package set rental_email=?,rental_reservation_id=? where package_id=? and city=?`,
          [
            req.body.rental_email,
            rental_res_id,
            req.body.package_id,
            req.body.city,
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
module.exports = {
  GuideRentalPackageCheckTable,
  insertPackageGuide,
  insertPackageRental,
};
