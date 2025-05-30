const pool = require("../dbConnection.js");
const {
  guideReservationCheckTable,
} = require("./GuideReservationController.js");
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
  console.log("signin:", req.body);
  pool.query(
    `select u.*,a.status from user u join accountStatus a on u.email=a.email where u.email = ?;`,
    [req.body.email],
    (err, results) => {
      console.log("sigin results", results);
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
JOIN 
    feedback f ON u.email = f.receiver_email 
JOIN
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
const getGuides = async (req, res) => {
  console.log("req.body;", req.body);
  await guideReservationCheckTable();
  pool.query(
    `SELECT u.first_name,u.last_name,u.phone,u.email,u.address,u.city,COALESCE(AVG(f.rating), 0) AS rating,p.price_per_day
FROM user u
JOIN 
    feedback f ON u.email = f.receiver_email 
JOIN
    accountStatus a ON u.email = a.email
JOIN
    price p ON u.email=p.email     
WHERE 
u.role_ID = (SELECT role_ID FROM role WHERE name = 'Tour Guide')

    AND a.status = 1 AND
u.city = ?
  AND u.email NOT IN (
    SELECT guide_email
    FROM guide_reservation
    WHERE start_date < ?
      AND end_date > ?
  ) 
      GROUP BY u.email;`,
    [req.body.city, req.body.end_date, req.body.start_date],
    (err, results) => {
      if (results) {
        return res.json({ code: 200, data: results });
      } else {
        res.json({ code: 500, data: err });
      }
    }
  );
};
const getRentals = async (req, res) => {
  console.log("req.body;", req.body);
  await guideReservationCheckTable();
  pool.query(
    `SELECT u.first_name,u.last_name,u.phone,u.email,u.address,u.city,COALESCE(AVG(f.rating), 0) AS rating,c.capacity,c.description,c.plate,p.price_per_day
FROM user u
JOIN 
    feedback f ON u.email = f.receiver_email 
JOIN
    accountStatus a ON u.email = a.email 
JOIN
    car c on u.email=c.email  
JOIN
    price p ON u.email=p.email       
WHERE 
u.role_ID = (SELECT role_ID FROM role WHERE name = 'Car Rental')

    AND a.status = 1 AND
u.city = ?
  AND u.email NOT IN (
    SELECT guide_email
    FROM guide_reservation
    WHERE start_date < ?
      AND end_date > ?
  ) 
      GROUP BY u.email;`,
    [req.body.city, req.body.end_date, req.body.start_date],
    (err, results) => {
      if (results) {
        return res.json({ code: 200, data: results });
      } else {
        res.json({ code: 500, data: err });
      }
    }
  );
};
const getAdminHotels = async (req, res) => {
  await UserCheckTable();
  pool.query(
    `SELECT 
    u.*, 
    a.status,
    COALESCE(AVG(f.rating), 0) AS rating 
FROM 
    user u
JOIN 
    feedback f ON u.email = f.receiver_email 
JOIN
    accountStatus a ON u.email = a.email        
WHERE 
    u.role_ID = (SELECT role_ID FROM role WHERE name = 'Hotel Management')
       
GROUP BY 
    u.email; `,
    (err, results) => {
      if (err) {
        res.json({ code: 500, data: err });
      } else {
        return res.json({ code: 200, data: results });
      }
    }
  );
};
const getAdminAirlines = async (req, res) => {
  await UserCheckTable();
  pool.query(
    `SELECT 
    u.*, 
    a.status,
    COALESCE(AVG(f.rating), 0) AS rating 
FROM 
    user u
JOIN 
    feedback f ON u.email = f.receiver_email 
JOIN
    accountStatus a ON u.email = a.email        
WHERE 
    u.role_ID = (SELECT role_ID FROM role WHERE name = 'Airline Company')
       
GROUP BY 
    u.email; `,
    (err, results) => {
      if (err) {
        res.json({ code: 500, data: err });
      } else {
        return res.json({ code: 200, data: results });
      }
    }
  );
};
const getAdminGuides = async (req, res) => {
  await UserCheckTable();
  pool.query(
    `SELECT 
    u.*, 
    a.status,
    COALESCE(AVG(f.rating), 0) AS rating,
    p.price_per_day AS price 
FROM 
    user u
JOIN 
    feedback f ON u.email = f.receiver_email 
JOIN
    accountStatus a ON u.email = a.email
JOIN
    price p on u.email=p.email            
WHERE 
    u.role_ID = (SELECT role_ID FROM role WHERE name = 'Tour Guide')
       
GROUP BY 
    u.email; `,
    (err, results) => {
      if (err) {
        res.json({ code: 500, data: err });
      } else {
        return res.json({ code: 200, data: results });
      }
    }
  );
};
const getAdminRentals = async (req, res) => {
  await UserCheckTable();
  pool.query(
    `SELECT 
    u.*, 
    a.status,
    COALESCE(AVG(f.rating), 0) AS rating,
    p.price_per_day AS price,
    c.capacity,c.description,c.plate
FROM 
    user u
JOIN 
    feedback f ON u.email = f.receiver_email 
JOIN
    accountStatus a ON u.email = a.email   
JOIN
    price p on u.email=p.email            
JOIN
    car c on u.email=c.email            
WHERE 
    u.role_ID = (SELECT role_ID FROM role WHERE name = 'Car Rental')
       
GROUP BY 
    u.email; `,
    (err, results) => {
      if (err) {
        res.json({ code: 500, data: err });
      } else {
        return res.json({ code: 200, data: results });
      }
    }
  );
};
const getAdminTourists = async (req, res) => {
  await UserCheckTable();
  pool.query(
    `SELECT 
    u.*, 
    a.status,
    COALESCE(AVG(f.rating), 0) AS rating 
FROM 
    user u
JOIN 
    feedback f ON u.email = f.receiver_email 
JOIN
    accountStatus a ON u.email = a.email        
WHERE 
    u.role_ID = (SELECT role_ID FROM role WHERE name = 'Tourist')
       
GROUP BY 
    u.email; `,
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
  UserCheckTable,
  getGuides,
  getRentals,
  getAdminHotels,
  getAdminAirlines,
  getAdminGuides,
  getAdminRentals,
  getAdminTourists,
};
