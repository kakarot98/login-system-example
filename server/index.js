const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require('bcrypt')
const saltRounds = 10

const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "root",
  database: "test_auth",
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  bcrypt.hash(password, saltRounds, (err, hash)=> {

    if(err){
      console.log(err)
      res.send({err:err})
    }
    db.query(
      "INSERT INTO users (username, passwords) VALUES (?,?)",
      [username, hash],
      (err, result) => {
        if (err) {
          res.send({ err: err });
        } else {
          res.send({ message: "user has been added" });
        }
      }
    );
  })


  
});


app.get("/login", (req, res)=> {
  if(req.session.user){
    res.send({loggedIn: true, user: req.session.user})
  } else {
    res.send({loggedIn: false})
  }
})

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length>0) {
        //res.send(result);
        bcrypt.compare(password, result[0].passwords, (err, response)=>{
          if(response){
            req.session.user = result
            console.log(req.session.user)
            res.send(result)
          } else {
            res.send({ message: "wrong combination of username/password", err: "wrong combination" })
          }
        })
      } else {
        console.log("no such thing found")
        res.send({ message: "user does not exist", err: "404 not found" });
      }
    }
  );
});

app.listen(3001, () => {
  console.log("server running");
});
