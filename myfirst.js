const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const mysql = require('mysql');
const { 
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');
const { emit } = require('nodemon');
const cors = require('cors');


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


app.post("/api/insert", (req, res) => {
  // const user_id = uuidv1();
  // const user_name = "user3";
  // const password = "123456";
  // const phone_number = "5197815342";
  // const email = "user3@gmail.com";
  // const sqlinsert = "INSERT INTO user values(?,?,?,?,?);";
  // db.query(sqlinsert,[user_id, user_name, password, phone_number, email], (err, result)=> {
  //   res.send("success insert!");
  // });

  //res.send("hello world!");

  //const email = "user1@gmail.com";
  const email = req.body.userEmail;
  const password = req.body.password;
  const isDriver = req.body.isDriver;
  const sqlinsert = "INSERT INTO user values(?,?,?);";
  db.query(sqlinsert,[email, password, isDriver], (err, result)=> {
    res.send("success insert!");
     //res.send("success insert!");
     //res.send(asDriver);
   });
});

app.listen(3001, () => {
  console.log("running on port 3001");
});