const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const mysql = require('mysql');
const uuid = require('uuid')
const { emit } = require('nodemon');
const cors = require('cors');
let currentUser = 0 ; // true if current user is a driver
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
    console.log(result);
    currentUser = result[0].isDriver;
    console.log(currentUser);
  });
  const sqlCheck = "SELECT COUNT(*) AS userCount, isDriver FROM user WHERE email = (?) AND password = (?);";
  db.query(sqlCheck, [userEmail, password], (err, result) => {
    if (result[0].userCount == 1) {
      if (result[0].isDriver == 0) {
        res.send('User login')
      } else {
        res.send('Driver login')
      }
    } else {
      res.send('No account match');
    }
  });
});

// display posts
app.post("/api/dbinfo", (req, res) => {
    // if log in as user, only postings that are not reserved by the user should be displayed
    // if log in as driver, only his/her own postings should be displayed
    if (currentUser) {
      console.log("Driver");
      const sqlGetPost = "SELECT * FROM posting NATURAL JOIN ProvideCarpool WHERE email = ?;";
      db.query(sqlGetPost, [currentUserEmail], (err, result) => {
        res.send(result);
      });
    } else {
      console.log("User");
      const FromLoc = req.body.From;
      const ToLoc = req.body.To;
      const Sort = req.body.SortBy;
      const ordering = req.body.Order;
      // if user do not apply any selection or ordering requirement
      if (FromLoc == "" && ToLoc == "" && Sort == "" && ordering == "") {
        console.log("NO FILTER");
        const sqlGetPost = "SELECT * FROM posting WHERE post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?);"
        db.query(sqlGetPost, [currentUserEmail + '%'], (err, result) => {
          console.log(err);
          res.send(result);
        });
      } else if (FromLoc != "" && ToLoc != "" && Sort == "" && ordering == "") {
        // User only apply selection
        console.log("FILTER");
        const sqlGetPost = "SELECT * FROM posting WHERE pickup_location = ? AND dropoff_location = ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?);"
        db.query(sqlGetPost, [FromLoc, ToLoc, currentUserEmail + '%'], (err, result) => {
          console.log(err);
          res.send(result);
        });
      } else if (FromLoc == "" && ToLoc == "" && Sort != "" && ordering != "") {
        // User only apply sorting
        console.log("Sorting");
        if (Sort == "Price") {
          var sqlGetPost;
          if (ordering == "Ascending") {
            sqlGetPost = "SELECT * FROM posting WHERE post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY price_per_seat";
          } else {
            sqlGetPost = "SELECT * FROM posting WHERE post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY price_per_seat DESC";
          }
          db.query(sqlGetPost, [currentUserEmail + '%'], (err, result) => {
            console.log(err);
            res.send(result);
          })
        } else if (Sort == "Seats Available") {
          var sqlGetPost;
          if (ordering == "Ascending") {
            sqlGetPost = "SELECT * FROM posting WHERE post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY available_seats";
          } else {
            sqlGetPost = "SELECT * FROM posting WHERE post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY available_seats DESC";
          }
          db.query(sqlGetPost, [currentUserEmail + '%'], (err, result) => {
            console.log(err);
            res.send(result);
          })
        } else {
          var sqlGetPost;
          if (ordering = "Ascending") {
            sqlGetPost = "SELECT * FROM posting WHERE post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY pickup_time";
          } else {
            sqlGetPost = "SELECT * FROM posting WHERE post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY pickup_time DESC";
          }
          db.query(sqlGetPost, [currentUserEmail + '%'], (err, result) => {
            console.log(err);
            res.send(result);
          })
        }
      } else if (FromLoc != "" && ToLoc != "" && Sort != "" && ordering != "") {
        // User apply both selection and sorting
        console.log("FILTER & SORTING");
        if (Sort == "Price") {
          var sqlGetPost;
          if (ordering = "Ascending") {
            sqlGetPost = "SELECT * FROM posting WHERE pickup_location = ? AND dropoff_location = ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY price_per_seat";
          } else {
            sqlGetPost = "SELECT * FROM posting WHERE pickup_location = ? AND dropoff_location = ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY price_per_seat DESC";
          }
          db.query(sqlGetPost, [FromLoc, ToLoc, currentUserEmail + '%'], (err, result) => {
            console.log(err);
            res.send(result);
          })
        } else if (Sort == "Seats Available") {
          var sqlGetPost;
          if (ordering == "Ascending") {
            sqlGetPost = "SELECT * FROM posting WHERE pickup_location = ? AND dropoff_location = ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY available_seats";
          } else {
            sqlGetPost = "SELECT * FROM posting WHERE pickup_location = ? AND dropoff_location = ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY available_seats DESC";
          }
          db.query(sqlGetPost, [FromLoc, ToLoc, currentUserEmail + '%'], (err, result) => {
            console.log(err);
            res.send(result);
          })
        } else {
          var sqlGetPost;
          if (ordering == "Ascending") {
            sqlGetPost = "SELECT * FROM posting WHERE pickup_location = ? AND dropoff_location = ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY pickup_time";
          } else {
            sqlGetPost = "SELECT * FROM posting WHERE pickup_location = ? AND dropoff_location = ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY pickup_time DESC";
          }
          db.query(sqlGetPost, [FromLoc, ToLoc, currentUserEmail + '%'], (err, result) => {
            console.log(err);
            res.send(result);
          })
        }
      }
    }
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

// display user reservations
app.post("/api/reserveInfo", (req, res)=> {
  const sqlreserve = "SELECT * FROM posting WHERE post_id IN (SELECT posting_id FROM reservation WHERE user_email LIKE ?);"
  db.query(sqlreserve, [currentUserEmail + '%'], (err, result) => {
    res.send(result);
    console.log(currentUserEmail);
    console.log("Display user reservation");
  })
})


// make reservations
app.post("/api/reserve", (req, res) => {
  console.log(req.body.post_id);
  if (currentUser == false){ // Current user can make reservation if one is not a driver
    const post_id = req.body.post_id;
    const sqlinsert = "INSERT INTO reservation values(?,?,?);";
    const random_id = uuid.v4();
    db.query(sqlinsert,[random_id, post_id, currentUserEmail], (err, result)=> {
      res.send("successful reservation!");
      console.log("make reservation");
    });
  }
});

// make reservations
app.post("/api/cancel", (req, res) => {
  console.log(req.body.post_id);
  if (currentUser == false){ // Current user can make reservation if one is not a driver
    const post_id = req.body.post_id;
    const sqldelete = "DELETE FROM reservation WHERE posting_id = ? AND user_email LIKE ?;";
    db.query(sqldelete,[post_id, currentUserEmail + '%'], (err, result)=> {
      res.send("Your reservation is cancelled!");
      console.log(err);
    });
  }
});


app.listen(3001, () => {
  console.log("running on port 3001");
});