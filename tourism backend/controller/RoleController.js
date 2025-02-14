const pool = require("../dbConnection.js");
const createAndPopulateRole = async () => {
  await pool.query(`create table if not exists role(
        role_ID int primary key,
        name varchar(20) not null
      );`);
  await pool.query(
    `insert ignore into role(role_ID, name) values(1, 'Tourist');`
  );
  await pool.query(
    `insert ignore into role(role_ID, name) values(2, 'Hotel Management');`
  );
  await pool.query(
    `insert ignore into role(role_ID, name) values(3, 'Airline Company');`
  );
  await pool.query(
    `insert ignore into role(role_ID, name) values(4, 'Tour Guide');`
  );
  await pool.query(
    `insert ignore into role(role_ID, name) values(5, 'Admin');`
  );
  await pool.query(
    `insert ignore into role(role_ID, name) values(6, 'Car Rental');`
  );
  console.log("Role table created and populated successfully.");
};
module.exports = { createAndPopulateRole };
