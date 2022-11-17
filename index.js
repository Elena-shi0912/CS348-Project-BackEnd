const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const mysql = require('mysql');
const uuid = require('uuid')
const { emit } = require('nodemon');
const cors = require('cors');
let currentUser = 1 ; // true if current user is a driver
let currentUserEmail = "";


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '20020912@Syy',
    database: 'carpool',
});

app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({extended: true}));

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.post('/api/g', (req, res)=> {
  const sqlSelect = "SELECT * FROM user";
  db.query(sqlSelect, (err, result) => {
    //console.log(result);
    res.send(result);
  })
});


// create account, insert to user table
app.post("/api/insert", (req, res) => {
  const email = req.body.userEmail;
  const password = req.body.password;
  const isDriver = req.body.isDriver;
  const name = req.body.userName;
  const phone = req.body.phoneNumber;
  const sqlinsert = "INSERT INTO user values(?,?,?);";
  db.query(sqlinsert,[email, password, isDriver], (err, result)=> {
    res.send("successful insert!");
   });
  if (isDriver == false) {
    const sqlinsert_user = "INSERT INTO UserProfile values(?,?,?)";
    db.query(sqlinsert_user, [email, name, phone], (err, result)=> {
      console.log("create User Profile successfully!");
    });
  } else {
    const sqlinsert_user = "INSERT INTO DriverProfile values(?,?,?,?)";
    db.query(sqlinsert_user, [email, name, phone, 0], (err, result)=> {
      console.log("create Driver Profile successfully!");
    });
  }
});

// log in, check if password correct
app.post("/api/check", (req, res) => {
  //const email = req.body.userEmail;
  //const password = req.body.password;
  const sqlCheckDriver = "SELECT isDriver FROM user WHERE email = (?);";
  const userEmail = req.body.userEmail;
  const password = req.body.password;
  currentUserEmail = req.body.userEmail;
  db.query(sqlCheckDriver, [userEmail], (err, result) => {
    currentUser = result[0].isDriver;
    console.log(currentUser);
  });
  const sqlCheck = "SELECT COUNT(*) AS userCount FROM user WHERE email = (?) AND password = (?);";
  db.query(sqlCheck, [userEmail, password], (err, result) => {
    if (result[0].userCount == 1) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
});

// display posts
app.get("/api/dbinfo", (req, res) => {
  //const info = req.body.info;
  ///
  //info = "I need post";
  //currentUser = true;
  ///
  //console.log("Here");
  // send posting information
  //if (info == "I need post") {
    // check if current user is a driver
    if (currentUser) {
      console.log("Driver");
      const sqlGetPost = "SELECT * FROM posting NATURAL JOIN ProvideCarpool WHERE email = ?;";
      db.query(sqlGetPost, [currentUserEmail], (err, result) => {
        res.send(result);
      });
    } else {
      console.log("Not Driver");
      const sqlGetPost = "SELECT * FROM posting;"
      db.query(sqlGetPost, (err, result) => {
        res.send(result);
      });
    }
  //}
});

// display user information
app.get("/api/accountinfo", (req, res) => {
    //const email = currentUserEmail;
    const email = "Eason@gmail.com"; //
    if (currentUser) {
      console.log("Driver");
      const sqlGetPost = "SELECT * FROM user NATURAL JOIN driverprofile WHERE email = ?;";
      db.query(sqlGetPost, [email], (err, result) => {
        res.send(result);
      });
    } else {
      console.log("Not Driver");
      const sqlGetPost = "SELECT * FROM user NATURAL JOIN userprofile WHERE email = ?;";
      db.query(sqlGetPost, [email], (err, result) => {
        res.send(result);
      });
    }
  //}
});

// Update seats available in posting
app.post("/api/updateseats", (req, res) => {
  const post_id = req.body.post_id;
  const available_seats = req.body.available_seats;
  const sqlupdate = "UPDATE posting SET available_seats = ? WHERE post_id = ?;";
  db.query(sqlupdate,[available_seats, post_id], (err, result)=> {
    res.send("successful update!");
   });
});


// make reservations
app.post("/api/reserve", (req, res) => {
  // const currentUser = false; //!
  // const currentUserEmail = "y2797che@uwaterloo.ca"; //
  if (currentUser == false){ // Current user can make reservation if one is not a driver
    const post_id = req.body.post_id;
    //const post_id = "2fd268f6-4f56-11ed-bdc3-0242ac120002";
    const sqlinsert = "INSERT INTO reservation values(?,?,?);";
    const random_id = uuid.v4();
    db.query(sqlinsert,[random_id, post_id, currentUserEmail], (err, result)=> {
      res.send("successful reservation!");
      console.log("success");
    });
  }
});


app.listen(3001, () => {
  console.log("running on port 3001");
});