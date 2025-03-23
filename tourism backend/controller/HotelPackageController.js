const pool = require("../dbConnection.js");
const HotelPackageCheckTable = async () => {
    try {
      await pool.query(`create table if not exists hotel_package(
        package_id int not null,
        city varchar(30) not null,
        hotel_email varchar(30) not null,
        room_id int not null,
        resevation_id int not null,
        days_stay int not null,
        foreign key (package_id) references flight_package(package_id));`);
      const [tableExists] = await pool.query(
        "SHOW TABLES LIKE 'hotel_package';"
      );
      console.log("table exists result:", tableExists);
      console.log("created hotel package");
    } catch (error) {
      console.log("error creating hotel package", error);
    }
  };
  
  module.exports={HotelPackageCheckTable}