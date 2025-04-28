const pool = require("../dbConnection.js");
const FeedbackCheckTable = async () => {
  await pool.query(`create table if not exists feedback(
        feedback_id int auto_increment primary key,
        sender_email varchar(30) not null,
        receiver_email varchar(30) not null,
        rating float not null,
        description varchar(500) not null;`);
};
const getFeedbackData = async (req, res) => {
  await FeedbackCheckTable();
  pool.query(
    `SELECT f.*,u.first_name,u.last_name,(SELECT AVG(rating) FROM feedback WHERE receiver_email=?) AS avg_rating FROM feedback f 
JOIN USER u ON f.sender_email=u.email WHERE receiver_email = ?;`,
    [req.body.email, req.body.email],
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
const insertFeedback = async (req, res) => {
  await FeedbackCheckTable();
  console.log("feedback:", req.body);
  pool.query(
    `insert into feedback(sender_email,receiver_email,rating,description) values(?,?,?,?);`,
    [req.body.email, req.body.t_email, req.body.rate, req.body.desc],
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

module.exports = { getFeedbackData, insertFeedback, FeedbackCheckTable };
