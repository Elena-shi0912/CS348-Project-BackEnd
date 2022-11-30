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
    // NOTE: only ongoing posting will be displayed
    console.log("=====HERE=====")
    const datetime = req.body.datetime;
    console.log(datetime)
    if (currentUser) {
      console.log("Display Driver ongoing posting");
      const sqlGetPost = "SELECT * FROM posting NATURAL JOIN ProvideCarpool WHERE pickup_time > ? AND email = ?;";
      db.query(sqlGetPost, [datetime, currentUserEmail], (err, result) => {
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
        const sqlGetPost = "SELECT * FROM posting WHERE pickup_time > ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?);"
        db.query(sqlGetPost, [datetime, currentUserEmail + '%'], (err, result) => {
          console.log(err);
          res.send(result);
        });
      } else if (FromLoc != "" && ToLoc != "" && Sort == "" && ordering == "") {
        // User only apply selection
        console.log("FILTER");
        const sqlGetPost = "SELECT * FROM posting WHERE pickup_time > ? AND pickup_location = ? AND dropoff_location = ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?);"
        db.query(sqlGetPost, [datetime, FromLoc, ToLoc, currentUserEmail + '%'], (err, result) => {
          console.log(err);
          res.send(result);
        });
      } else if (FromLoc == "" && ToLoc == "" && Sort != "" && ordering != "") {
        // User only apply sorting
        console.log("Sorting");
        if (Sort == "Price") {
          var sqlGetPost;
          if (ordering == "Ascending") {
            sqlGetPost = "SELECT * FROM posting WHERE pickup_time > ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY price_per_seat";
          } else {
            sqlGetPost = "SELECT * FROM posting WHERE pickup_time > ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY price_per_seat DESC";
          }
          db.query(sqlGetPost, [datetime, currentUserEmail + '%'], (err, result) => {
            console.log(err);
            res.send(result);
          })
        } else if (Sort == "Seats Available") {
          var sqlGetPost;
          if (ordering == "Ascending") {
            sqlGetPost = "SELECT * FROM posting WHERE pickup_time > ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY available_seats";
          } else {
            sqlGetPost = "SELECT * FROM posting WHERE pickup_time > ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY available_seats DESC";
          }
          db.query(sqlGetPost, [datetime, currentUserEmail + '%'], (err, result) => {
            console.log(err);
            res.send(result);
          })
        } else {
          var sqlGetPost;
          if (ordering = "Ascending") {
            sqlGetPost = "SELECT * FROM posting WHERE pickup_time > ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY pickup_time";
          } else {
            sqlGetPost = "SELECT * FROM posting WHERE pickup_time > ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY pickup_time DESC";
          }
          db.query(sqlGetPost, [datetime, currentUserEmail + '%'], (err, result) => {
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
            sqlGetPost = "SELECT * FROM posting WHERE pickup_time > ? AND pickup_location = ? AND dropoff_location = ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY price_per_seat";
          } else {
            sqlGetPost = "SELECT * FROM posting WHERE pickup_time > ? AND pickup_location = ? AND dropoff_location = ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY price_per_seat DESC";
          }
          db.query(sqlGetPost, [datetime, FromLoc, ToLoc, currentUserEmail + '%'], (err, result) => {
            console.log(err);
            res.send(result);
          })
        } else if (Sort == "Seats Available") {
          var sqlGetPost;
          if (ordering == "Ascending") {
            sqlGetPost = "SELECT * FROM posting WHERE pickup_time > ? AND pickup_location = ? AND dropoff_location = ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY available_seats";
          } else {
            sqlGetPost = "SELECT * FROM posting WHERE pickup_time > ? AND pickup_location = ? AND dropoff_location = ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY available_seats DESC";
          }
          db.query(sqlGetPost, [datetime, FromLoc, ToLoc, currentUserEmail + '%'], (err, result) => {
            console.log(err);
            res.send(result);
          })
        } else {
          var sqlGetPost;
          if (ordering == "Ascending") {
            sqlGetPost = "SELECT * FROM posting WHERE pickup_time > ? AND pickup_location = ? AND dropoff_location = ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY pickup_time";
          } else {
            sqlGetPost = "SELECT * FROM posting WHERE pickup_time > ? AND pickup_location = ? AND dropoff_location = ? AND post_id NOT IN (SELECT posting_id FROM Reservation WHERE user_email LIKE ?) ORDER BY pickup_time DESC";
          }
          db.query(sqlGetPost, [datetime, FromLoc, ToLoc, currentUserEmail + '%'], (err, result) => {
            console.log(err);
            res.send(result);
          })
        }
      }
    }
});

// display user information
app.post("/api/accountinfo", (req, res) => {
    // //const email = currentUserEmail;
    // const email = "Eason@gmail.com"; //
    console.log("want to access user info")
    if (currentUser) {
      console.log("Driver");
      const sqlGetPost = "SELECT * FROM driverprofile WHERE email = ?;";
      db.query(sqlGetPost, [currentUserEmail], (err, result) => {
        res.send(result);
        console.log(result);
      });
    } else {
      console.log("Not Driver");
      const sqlGetPost = "SELECT * FROM userprofile WHERE email = ?;";
      db.query(sqlGetPost, [currentUserEmail], (err, result) => {
        res.send(result);
      });
    }
  //}
});

// display user's ongoing reservations
app.post("/api/reserveInfo", (req, res)=> {
  const time = req.body.datetime; // current time get from frontend
  const sqlreserve = "SELECT * FROM posting WHERE pickup_time > ? AND post_id IN (SELECT posting_id FROM reservation WHERE user_email LIKE ?);"
  db.query(sqlreserve, [time, currentUserEmail + '%'], (err, result) => {
    res.send(result);
    console.log(currentUserEmail);
    console.log("Display user reservation");
  })
})

// display user's past reservations that have not been reviewed
app.post("/api/reviewInfo", (req, res) => {
  const time = req.body.datetime;
  const sqlpast = "SELECT * FROM posting WHERE pickup_time < ? AND post_id IN (SELECT posting_id FROM reservation WHERE user_email LIKE ? AND reservation_id NOT IN (SELECT reservation_id from Review WHERE Reservation.reservation_id = Review.reservation_id));"
  db.query(sqlpast,[time, currentUserEmail + '%'], (err, result) => {
    console.log("showing users past unreviewed reservations");
    console.log(err);
    res.send(result);
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

// cancel reservations
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

// Driver create posting
app.post("/api/addPosting", (req,res) => {
  console.log(currentUserEmail+ " wants to create new post");
  const new_post_id = uuid.v4();
  const fromLoc = req.body.from;
  const toLoc = req.body.to;
  const seats = req.body.seats;
  const price = req.body.price;
  const info = req.body.info;
  const datetime = req.body.datetime;
  console.log(datetime);
  // insert into provideCarpool first
  var sqlCreatePost = "INSERT INTO ProvideCarpool value(?,?);"
  db.query(sqlCreatePost,[currentUserEmail, new_post_id], (err,result) => {
    console.log(err);
    console.log("create provideCarpool record successfully");
  })
  sqlCreatePost = "INSERT INTO Posting value(?,?,?,?,?,?,?);"
  db.query(sqlCreatePost,[new_post_id,fromLoc,toLoc,datetime,seats,price,info],(err,result) => {
    console.log(err)
    console.log("successfully create posting")
    res.send("Your new post is created!")
  })
})

// User make review
app.post("/api/addReview", (req, res) => {
  console.log(currentUserEmail + " is going to make review");
  const post_id = req.body.post_id;
  const rating = req.body.rating;
  const comment = req.body.comment;
  const time = req.body.datetime;
  var reservation_id;
  var driverEmail = "";
  const sqlFindReservation = "SELECT reservation_id FROM Reservation WHERE posting_id = ?;"
  db.query(sqlFindReservation, [post_id], (err, result) => {
    console.log("Find out corresponding reservation id")
    console.log(err)
    reservation_id = result[0].reservation_id;
    const sqlFindDriver = "SELECT email FROM ProvideCarpool WHERE post_id = ?;"
    db.query(sqlFindDriver,[post_id],(err, result) => {
      console.log("Find out corresponding driver")
      console.log(err)
      driverEmail = result[0].email;
      const sqlAddReview = "INSERT INTO Review value(?,?,?,?,?);"
      db.query(sqlAddReview,[reservation_id,driverEmail,rating,comment,time], (err, result) => {
        console.log(err)
        console.log(currentUserEmail + " add review to reservation with id " + reservation_id + " provided by " + driverEmail);
        res.send("Your review is added successfully");
      })
    })
  })
})

app.listen(3001, () => {
  console.log("running on port 3001");
});