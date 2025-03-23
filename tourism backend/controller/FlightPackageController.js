const pool = require("../dbConnection.js");
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
  console.log("req.body:", req.body);
  console.log(
    "req.body keys:",
    Object.keys(req.body.dataObject.Karachi.room_packages)
  );
  for (const city in req.body.dataObject) {
    console.log("city:", city);
    console.log("city object:", req.body.dataObject[city]);
  }
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    await connection.query(
      `insert into flight_package(tourist_email,current_country,current_city,package_country,flight_id,return_flight_id) values(?,?,?,?,?,?);`,
      [
        req.body.email,
        req.body.departureCountry,
        req.body.departureCity,
        req.body.arrivalCountry,
        req.body.flightID,
        req.body.returnFlightID,
      ]
    );
    //more queries
    const [rows] = await connection.query(`select LAST_INSERT_ID();`);
    const package_id = rows[0]["LAST_INSERT_ID()"];

    // await connection.commit();
    // connection.release();
    // return res.json({ code: 200, message: "Transaction successful" });
  } catch (error) {
    // if (connection) {
    //   await connection.rollback();
    //   connection.release();
    // }
    // return res.json({ code: 500, data: error });
  }
};
module.exports = { insertPackage };
