const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const mysql = require('mysql');
// const { 
//   v1: uuidv1,
//   v4: uuidv4,
// } = require('uuid');
const { emit } = require('nodemon');
const cors = require('cors');
let currentUser = false; // true if current user is a driver
let currentUserEmail = "";


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "20020131",
  database: "test"
});

app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({extended: true}));

// db.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   var sqlinsert = "INSERT INTO user (user_id, user_name, password, phone_number, email) values('111','user3','123456','5197815342','user3@gmail.com');";
//   db.query(sqlinsert, function(err, result) {
//     if (err) throw err;
//     console.log("one record inserted!")
//     //res.send("success insert!");
//   });
// })

app.post('/api/g', (req, res)=> {
  const sqlSelect = "SELECT * FROM user";
  db.query(sqlSelect, (err, result) => {
    //console.log(result);
    res.send(result);
  })
})


// create account, insert to user table
app.post("/api/insert", (req, res) => {
  const email = req.body.userEmail;
  const password = req.body.password;
  const isDriver = req.body.isDriver;
  const sqlinsert = "INSERT INTO user values(?,?,?);";
  db.query(sqlinsert,[email, password, isDriver], (err, result)=> {
    res.send("success insert!");
   });
});

// log in, check if password correct
app.get("/api/check", (req, res) => {
  //const email = req.body.userEmail;
  //const password = req.body.password;
  const sqlCheckDriver = "SELECT isDriver FROM user WHERE email = (?);";
  const email = "1";
  const password = "123456";
  currentUserEmail = email;
  db.query(sqlCheckDriver, [email], (err, result) => {
    currentUser = result[0].isDriver;
    //console.log(currentUserEmail);
  });
  const sqlCheck = "SELECT COUNT(*) AS userCount FROM user WHERE email = (?) AND password = (?);";
  db.query(sqlCheck, [email, password], (err, result) => {
    if (result[0].userCount == 1) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
});

// display posts
app.get("api/dbinfo", (req, res) => {
  const postInfo = "I need post";
  //const info = req.body.info;
  const info = postInfo;
  // send posting information
  if (info == postInfo) {
    // check if current user is a driver
    if (currentUser) {
      const sqlGetPost = "SELECT * FROM posting NATURAL JOIN ProvideCarpool WHERE email = ?;";
      db.query(sqlGetPost, [currentUserEmail], (err, result) => {
        res.send(result);
      });
    } else {
      const sqlGetPost = "SELECT * FROM posting;"
      db.query(sqlGetPost, (err, result) => {
        res.send(result);
      });
    }
  }
});

app.listen(3001, () => {
  console.log("running on port 3001");
});