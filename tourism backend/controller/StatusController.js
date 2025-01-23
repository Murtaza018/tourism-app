const pool = require("../dbConnection.js");
const AccountStatusCheckTable = async () => {
  await pool.query(`create table if not exists AccountStatus(
        email varchar(30) not null,
        status boolean default true,
        foreign key (email) references user(email));`);
};
module.exports = { AccountStatusCheckTable };
