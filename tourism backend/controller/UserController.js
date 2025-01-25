const pool = require("../dbConnection.js");
const stat = require("./StatusController.js");
const UserCheckTable = async () => {
  await pool.query(`create table if not exists user(
        first_name varchar(20) not null,
        last_name varchar(20) not null,
        phone varchar(20) not null,
        email varchar(30) primary key,
        age int not null,
        country varchar(20) not null,
        city varchar(20) not null,
        address varchar(100) not null,
        password varchar(30) not null,
        role_ID int not null,
        foreign key (role_ID) references role(role_ID));`);
};
const signInUser = async (req, res) => {
  await UserCheckTable();
  pool.query(
    `select * from user where email = ?;`,
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
const insertUser = async (req, res) => {
  await UserCheckTable();
  await stat.AccountStatusCheckTable();
  await pool.query(`insert into AccountStatus(email) values(?);`, [
    req.body.email,
  ]);
  pool.query(
    `insert into user(first_name,last_name,phone,email,age,country,city,address,password,role_ID) values(?,?,?,?,?,?,?,?,?,?);`,
    [
      req.body.first_name,
      req.body.last_name,
      req.body.phone,
      req.body.email,
      req.body.age,
      req.body.country,
      req.body.city,
      req.body.address,
      req.body.password,
      req.body.role_ID,
    ],
    (err, results) => {
      if (err) {
        res.json({ code: 500, data: err });
      } else {
        return res.json({ code: 200, data: "user created" });
      }
    }
  );
};
const updateUser = async (req, res) => {
  await UserCheckTable();
  pool.query(
    `update user set first_name=?,last_name=?,phone=?,age=?,country=?,city=?,address=?,password=? where email=?;`,
    [
      req.body.first_name,
      req.body.last_name,
      req.body.phone,
      req.body.age,
      req.body.country,
      req.body.city,
      req.body.address,
      req.body.password,
      req.body.email,
    ],
    (err, results) => {
      if (err) {
        res.json({ code: 500, data: err });
      } else {
        return res.json({ code: 200, data: "user updated" });
      }
    }
  );
};
const UserDataRetreival = async (req, res) => {
  await UserCheckTable();
  console.log(req.body);
  pool.query(
    `select * from user where email=?`,
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
const DeleteUser = async (req, res) => {
  await UserCheckTable();
  console.log(req.body);
  pool.query(
    `delete from user where email=?`,
    [req.body.email],
    (err, results) => {
      if (err) {
        res.json({ code: 500, data: err });
      } else {
        return res.json({ code: 200, data: "user deleted" });
      }
    }
  );
};
module.exports = {
  insertUser,
  signInUser,
  updateUser,
  UserDataRetreival,
  DeleteUser,
};
