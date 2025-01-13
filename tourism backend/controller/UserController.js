const pool = require("../dbConnection.js");
const checkTable = async () => {
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
const insertUser = async (req, res) => {
  await checkTable();
  console.log(req.body);
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

module.exports = { insertUser };
