module.exports = (app) => {
  const fs = require("fs");
  let Client = require("ssh2-sftp-client");
  const dotenv = require("dotenv");
  dotenv.config();

  const mysql = require("mysql2");
  const alarmdb = mysql.createPool({
    connectionLimit: 10,
    connectTimeout: 10000,
    host: "", //process.env.REACT_APP_SOLK_DB_01_HOST,
    user: "dbuser_rw",
    password: "", //process.env.REACT_APP_ALARM_DB_PASS,
    database: "nfvd",
    port: 3306,
  });

  app.get("/nfvd-errors", async (req, res) => {
    const sql = "SELECT * FROM nfvd_errors order by date desc";
    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  app.post("/nfvd-error-items", async (req, res) => {
    const error = req.body.error;
    const sql =
      "SELECT * FROM nfvd_errors WHERE error_message = '" +
      error +
      "' order by date desc";
    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  app.post("/nfvd-error", async (req, res) => {
    const error_message = req.body.error_message;
    const date = req.body.date;
    //const newDate = date.replace(/'/g, "\\'");
    const count = req.body.count;
    const sql =
      "INSERT INTO nfvd_errors (error_message, date, count) VALUES ('" +
      error_message +
      "', '" +
      date +
      "', '" +
      count +
      "');";
    console.log(sql);
    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  app.put("/update-error", async (req, res) => {
    const id = req.body.id;
    const count = req.body.count;
    const sql =
      "UPDATE nfvd_errors SET count = '" + count + "' WHERE id = '" + id + "';";
    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json("Error updated!");
      }
    });
  });
};
