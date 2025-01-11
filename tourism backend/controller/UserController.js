const pool = require("../dbConnection.js");
const checkTable = async () => {
  await pool.query(`create table if not exists user(
        first_name varchar(20) not null,
        last_name varchar(20) not null,
        phone varchar(20) not null,
        email varchar(30) primary key,
        age int not null,
        address varchar(100) not null,
        password varchar(30) not null);`);
};

const insertUser = async (req, res) => {
  await checkTable();
  console.log(req.body);
  pool.query(
    `insert into 
        user(first_name,last_name,phone,email,age,address,password)
        values(?,?,?,?,?,?,?);`,
    [
      req.body.first_name,
      req.body.last_name,
      req.body.phone,
      req.body.email,
      req.body.age,
      req.body.address,
      req.body.password,
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

module.exports = { insertUser };
