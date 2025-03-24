const pool = require("../dbConnection.js");
const HotelPackageCheckTable = async () => {
  await pool.query(`create table if not exists hotel_package(
        package_id int not null,
        city varchar(30) not null,
        hotel_email varchar(30) not null,
        room_id int not null,
        resevation_id int not null,
        days_stay int not null,
        foreign key (package_id) references flight_package(package_id));`);
};

module.exports = { HotelPackageCheckTable };
