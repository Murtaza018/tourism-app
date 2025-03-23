const pool = require("../dbConnection.js");
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
  
  module.exports={GuideRentalPackageCheckTable}