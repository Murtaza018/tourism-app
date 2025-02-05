const pool = require("../dbConnection.js");
const FeedbackCheckTable = async () => {
  await pool.query(`create table if not exists feedback(
        feedback_id int auto_increment primary key,
        sender_email varchar(30) not null,
        receiver_email varchar(30) not null,
        rating int not null,
        description varchar(500) not null,
        foreign key (receiver_email) references user(email),
        foreign key (sender_email) references user(email));`);
};

const getFeedbackData = async (req, res) => {
  await FeedbackCheckTable();
  pool.query(
    `select f.*,u.first_name,u.last_name from feedback f join user u on f.sender_email=u.email where receiver_email = ?;`,
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

module.exports = { getFeedbackData };
