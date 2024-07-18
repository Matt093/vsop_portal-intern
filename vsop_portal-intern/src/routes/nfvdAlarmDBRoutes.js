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

  app.get("/failed-jobs", async (req, res) => {
    const sql = "SELECT * FROM nfvd_failed_jobs order by start_time desc";

    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        res.json(data);
      }
    });
  });

  app.post("/failed-jobs-by-username", async (req, res) => {
    const uswin = req.body.uswin;
    const sql =
      "SELECT * FROM nfvd_failed_jobs WHERE username LIKE '%" +
      uswin +
      "%' order by start_time desc";
    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  app.put("/update-failure", async (req, res) => {
    const id = req.body.id;
    const notes = req.body.notes;
    const category = req.body.category;
    const sql =
      "UPDATE nfvd_failed_jobs SET notes = '" +
      notes +
      "', category = '" +
      category +
      "' WHERE id = '" +
      id +
      "';";
    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json("Failure updated!");
      }
    });
  });

  app.put("/update-failure-bulk", async (req, res) => {
    const error = req.body.error;
    const comment = req.body.comment;
    const category = req.body.category;
    const sql =
      "UPDATE nfvd_failed_jobs SET notes = '" +
      comment +
      "', category = '" +
      category +
      "' WHERE error_description = '" +
      error +
      "';";
    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json("Bulk of failures updated!");
      }
    });
  });

  app.post("/failed-operations", async (req, res) => {
    const intervTime = req.body.intervTime;
    let sql = "";
    if (intervTime.includes("DAY")) {
      sql =
        "SELECT COUNT(operation) AS count, operation FROM nfvd_failed_jobs WHERE start_time >= now() - INTERVAL " +
        intervTime +
        " group by operation ORDER BY count(operation) DESC LIMIT 10;";
    } else if (intervTime.includes("YEAR")) {
      sql =
        "SELECT COUNT(operation) AS count, operation FROM nfvd_failed_jobs WHERE YEAR(start_time) = YEAR(CURDATE()) group by operation ORDER BY count(operation) DESC LIMIT 10;";
    } else {
      sql =
        "SELECT COUNT(operation) AS count, operation FROM nfvd_failed_jobs WHERE QUARTER(start_time)=" +
        intervTime +
        " group by operation ORDER BY count(operation) DESC LIMIT 10;";
    }
    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  app.post("/failed-usernames", async (req, res) => {
    const intervTime = req.body.intervTime;
    let sql = "";
    if (intervTime.includes("DAY")) {
      sql =
        "SELECT COUNT(username) AS count, username FROM nfvd_failed_jobs WHERE start_time >= now() - INTERVAL " +
        intervTime +
        " group by username ORDER BY count(username) DESC LIMIT 10;";
    } else if (intervTime.includes("YEAR")) {
      sql =
        "SELECT COUNT(username) AS count, username FROM nfvd_failed_jobs WHERE YEAR(start_time) = YEAR(CURDATE()) group by username ORDER BY count(username) DESC LIMIT 10;";
    } else {
      sql =
        "SELECT COUNT(username) AS count, username FROM nfvd_failed_jobs WHERE QUARTER(start_time)=" +
        intervTime +
        " group by username ORDER BY count(username) DESC LIMIT 10;";
    }
    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  app.post("/failed-error-descriptions", async (req, res) => {
    const intervTime = req.body.intervTime;
    let sql = "";
    if (intervTime.includes("DAY")) {
      sql =
        "SELECT COUNT(error_description) AS count, error_description FROM nfvd_failed_jobs WHERE start_time >= now() - INTERVAL " +
        intervTime +
        " group by error_description ORDER BY count(error_description) DESC LIMIT 10;";
    } else if (intervTime.includes("YEAR")) {
      sql =
        "SELECT COUNT(error_description) AS count, error_description FROM nfvd_failed_jobs WHERE YEAR(start_time) = YEAR(CURDATE()) group by error_description ORDER BY count(error_description) DESC LIMIT 10;";
    } else {
      sql =
        "SELECT COUNT(error_description) AS count, error_description FROM nfvd_failed_jobs WHERE QUARTER(start_time)=" +
        intervTime +
        " group by error_description ORDER BY count(error_description) DESC LIMIT 10;";
    }
    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  app.post("/failed-categories", async (req, res) => {
    const intervTime = req.body.intervTime;
    let sql = "";
    if (intervTime.includes("DAY")) {
      sql =
        "SELECT COUNT(category) AS count, category FROM nfvd_failed_jobs WHERE start_time >= now() - INTERVAL " +
        intervTime +
        " group by category ORDER BY count(category) DESC;";
    } else if (intervTime.includes("YEAR")) {
      sql =
        "SELECT COUNT(category) AS count, category FROM nfvd_failed_jobs WHERE YEAR(start_time) = YEAR(CURDATE()) group by category ORDER BY count(category) DESC;";
    } else {
      sql =
        "SELECT COUNT(category) AS count, category FROM nfvd_failed_jobs WHERE QUARTER(start_time)=" +
        intervTime +
        " group by category ORDER BY count(category) DESC;";
    }
    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  app.post("/failed-job-names", async (req, res) => {
    const intervTime = req.body.intervTime;
    let sql = "";
    if (intervTime.includes("DAY")) {
      sql =
        "SELECT COUNT(job_name) AS count, job_name FROM nfvd_failed_jobs WHERE start_time >= now() - INTERVAL " +
        intervTime +
        " group by job_name ORDER BY count(job_name) DESC LIMIT 10;";
    } else if (intervTime.includes("YEAR")) {
      sql =
        "SELECT COUNT(job_name) AS count, job_name FROM nfvd_failed_jobs WHERE YEAR(start_time) = YEAR(CURDATE()) group by job_name ORDER BY count(job_name) DESC LIMIT 10;";
    } else {
      sql =
        "SELECT COUNT(job_name) AS count, job_name FROM nfvd_failed_jobs WHERE QUARTER(start_time)=" +
        intervTime +
        " group by job_name ORDER BY count(job_name) DESC LIMIT 10;";
    }
    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  app.post("/failures-acknowledged", async (req, res) => {
    const intervTime = req.body.intervTime;
    let sql = "";
    if (intervTime.includes("DAY")) {
      sql =
        "SELECT COUNT(*) AS count FROM nfvd_failed_jobs WHERE notes != '' && start_time >= now() - INTERVAL " +
        intervTime +
        ";";
    } else if (intervTime.includes("YEAR")) {
      sql =
        "SELECT COUNT(*) AS count FROM nfvd_failed_jobs WHERE notes != '' && YEAR(start_time) = YEAR(CURDATE());";
    } else {
      sql =
        "SELECT COUNT(*) AS count FROM nfvd_failed_jobs WHERE notes != '' && QUARTER(start_time)=" +
        intervTime +
        ";";
    }
    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  app.post("/total-failures", async (req, res) => {
    const intervTime = req.body.intervTime;
    let sql = "";
    if (intervTime.includes("DAY")) {
      sql =
        "SELECT COUNT(*) AS count FROM nfvd_failed_jobs WHERE start_time >= now() - INTERVAL " +
        intervTime +
        ";";
    } else if (intervTime.includes("YEAR")) {
      sql =
        "SELECT COUNT(*) AS count FROM nfvd_failed_jobs WHERE YEAR(start_time) = YEAR(CURDATE());";
    } else {
      sql =
        "SELECT COUNT(*) AS count FROM nfvd_failed_jobs WHERE QUARTER(start_time)=" +
        intervTime +
        ";";
    }
    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  app.get("/monthly-failures", async (req, res) => {
    const sql =
      "SELECT COUNT(*) as count, DATE_FORMAT(start_time, '%Y-%m-01') as month FROM nfvd_failed_jobs group by DATE_FORMAT(start_time,'%Y-%m-01') order by month;";
    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  app.get("/daily-failures", async (req, res) => {
    const sql =
      "SELECT COUNT(*) as count, DATE_FORMAT(start_time, '%Y-%m-%d') as day FROM nfvd_failed_jobs group by DATE_FORMAT(start_time,'%Y-%m-%d') ORDER BY day;";

    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  app.get("/monthly-failures-exclusions", async (req, res) => {
    const sql =
      "SELECT COUNT(*) as count, DATE_FORMAT(start_time, '%Y-%m-01') as month FROM nfvd_failed_jobs WHERE operation != 'NOTIFY' group by DATE_FORMAT(start_time,'%Y-%m-01') order by month;";

    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  app.get("/daily-failures-exclusions", async (req, res) => {
    const sql =
      "SELECT COUNT(*) as count, DATE_FORMAT(start_time, '%Y-%m-%d') as day FROM nfvd_failed_jobs WHERE operation != 'NOTIFY' group by DATE_FORMAT(start_time,'%Y-%m-%d') ORDER BY day;";

    alarmdb.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });
};
