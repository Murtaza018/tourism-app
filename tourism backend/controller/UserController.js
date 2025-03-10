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
  console.log(req.body);
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
//hello
const getHotels = async (req, res) => {
  await UserCheckTable();
  console.log("Hello ", req.body);
  pool.query(
    `SELECT 
    u.first_name, 
    u.last_name, 
    u.phone, 
    u.address, 
    u.email,
    u.city, 
    COALESCE(AVG(f.rating), 0) AS rating 
FROM 
    user u
LEFT JOIN 
    feedback f ON u.email = f.receiver_email 
LEFT JOIN
    accountStatus a ON u.email = a.email     
WHERE 
    u.role_ID = (SELECT role_ID FROM role WHERE name = 'Hotel Management')
    AND u.country = ?  
    AND u.city = ?    
    AND a.status = 1   
GROUP BY 
    u.email; `,
    [req.body.country, req.body.city],
    (err, results) => {
      if (err) {
        res.json({ code: 500, data: err });
      } else {
        return res.json({ code: 200, data: results });
      }
    }
  );
};
module.exports = {
  getHotels,
  insertUser,
  signInUser,
  updateUser,
  UserDataRetreival,
  DeleteUser,
};
