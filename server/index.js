const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "root",
  database: "test_auth",
});

app.post("/register", (req, res) => {
  const username = req.body.userName;
  const password = req.body.password;
  db.query(
    "INSERT INTO users (username, passwords) VALUES (?,?)",
    [username, password],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        res.send({ message: "user has been added" });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const username = req.body.userName;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE username = ? AND passwords = ?",
    [username, password],
    (err, result) => {
      if (err) {
        console.log({ err: err });
      }

      if (result) {
        res.send(result);
      } else {
        res.send({ message: "wrong combination of username/password" });
      }
    }
  );
});

app.listen(3001, () => {
  console.log("server running");
});
