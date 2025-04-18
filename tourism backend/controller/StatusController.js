const pool = require("../dbConnection.js");
const AccountStatusCheckTable = async () => {
  await pool.query(`create table if not exists AccountStatus(
        email varchar(30) not null,
        status boolean default true,
        foreign key (email) references user(email) on delete cascade);`);
};
const AccountStatusRetreival = async (req, res) => {
  console.log(req.body);
  await AccountStatusCheckTable();
  pool.query(
    `select status from AccountStatus where email = ?;`,
    [req.body.email],
    (err, results) => {
      if (results.length > 0) {
        console.log("Hi", results);
        return res.json({ code: 200, data: results });
      } else {
        res.json({ code: 500, data: err });
      }
    }
  );
};
const UpdateAccountStatus = async (req, res) => {
  await AccountStatusCheckTable();
  pool.query(
    `update AccountStatus set status=1 - status where email = ?;`,
    [req.body.email],
    (err, results) => {
      if (results) {
        console.log("Hi", results);
        return res.json({ code: 200, data: results });
      } else {
        res.json({ code: 500, data: err });
      }
    }
  );
};
const AdminUpdateAccountStatus = async (req, res) => {
  await AccountStatusCheckTable();
  console.log("body:", req.body);
  pool.query(
    `update AccountStatus set status=3 - status where email = ?;`,
    [req.body.email],
    (err, results) => {
      if (results) {
        console.log("Hi", results);
        return res.json({ code: 200, data: results });
      } else {
        res.json({ code: 500, data: err });
      }
    }
  );
};
module.exports = {
  AccountStatusCheckTable,
  AccountStatusRetreival,
  UpdateAccountStatus,
  AdminUpdateAccountStatus,
  AccountStatusCheckTable,
};
