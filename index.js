const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '20020912@Syy',
    database: 'CS348_Project',
})

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Database!");
    var sqlCreate = 
        "CREATE TABLE UserInfoTemp (UserID VARCHAR(36) NOT NULL DEFAULT(uuid()), Password VARCHAR(15) NOT NULL, UserName VARCHAR(15) NOT NULL, Phone DECIMAL(10,0) NOT NULL, Email VARCHAR(25) NOT NULL, PRIMARY KEY (UserID));";
    db.query(sqlCreate, function(err, result) {
        if (err) throw err;
        console.log("User Table Created!");
    });
    sqlCreate =
        "CREATE TABLE DriverInfoTemp (DriverID VARCHAR(36) NOT NULL DEFAULT(uuid()), DriverName VARCHAR(15) NOT NULL, PassWord VARCHAR(15) NOT NULL, License_Number CHAR(15) NOT NULL, Year_Of_Driving DECIMAL(2,0) NOT NULL, Phone DECIMAL(10) NOT NULL, Email VARCHAR(25) NOT NULL, PRIMARY KEY (DriverID));";
    db.query(sqlCreate, function(err, result) {
        if (err) throw err;
        console.log("Driver Table Created!");
    });

    sqlCreate =
        "CREATE TABLE CarInfoTemp (CarID VARCHAR(36) NOT NULL DEFAULT(uuid()), Driver_ID VARCHAR(36) NOT NULL, Car_Maker VARCHAR(20) NOT NULL, Car_Color VARCHAR(15) NOT NULL, Car_Model VARCHAR(25) NOT NULL, Year_Of_Car DECIMAL(2,0) NOT NULL, Car_Plate_Number VARCHAR(8) NOT NULL, PRIMARY KEY (CarID), INDEX DriverID_idx (Driver_ID ASC) VISIBLE, CONSTRAINT DriverID FOREIGN KEY (Driver_ID) REFERENCES DriverInfo (DriverID) ON DELETE CASCADE ON UPDATE NO ACTION);";
    db.query(sqlCreate, function(err, result) {
        if (err) throw err;
        console.log("Car Table Created!");
    });

    sqlCreate = 
        "CREATE TABLE PostInfo (PostID VARCHAR(36) NOT NULL DEFAULT(uuid()), CarID VARCHAR(36) NOT NULL, Pickup_Location VARCHAR(50) NOT NULL, Dropoff_Location VARCHAR(50) NOT NULL, Pickup_Date DATE NOT NULL, Pickup_Time TIME NOT NULL, Seats_Available DECIMAL(1,0) NOT NULL, Price_Per_Seat DECIMAL(4,0) NOT NULL, Additionl_Info VARCHAR(120) NULL, PRIMARY KEY (PostID), INDEX CarID_idx (CarID ASC) VISIBLE, CONSTRAINT CarID FOREIGN KEY (CarID) REFERENCES CarInfo (CarID) ON DELETE CASCADE ON UPDATE NO ACTION);";
    db.query(sqlCreate, function(err, result) {
        if (err) throw err;
        console.log("Posting Table Created!");
    });

    sqlCreate =
        "CREATE TABLE Review (PostID VARCHAR(36) NOT NULL, UserID VARCHAR(36) NOT NULL, Rating DECIMAL(1,0) NULL, Comment VARCHAR(150) NULL, CommentTime DATETIME NULL, PRIMARY KEY (PostID, UserID), INDEX UserID_idx (UserID ASC) VISIBLE, CONSTRAINT PostID FOREIGN KEY (PostID) REFERENCES PostInfo (PostID) ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT UserID FOREIGN KEY (UserID) REFERENCES UserInfo (UserID) ON DELETE CASCADE ON UPDATE NO ACTION);";
    db.query(sqlCreate, function(err, result) {
        if (err) throw err;
        console.log("Review Table Created!");
    });
    
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended : true}));

app.post("/api/init", (req, res) => {
    res.send("populate database with sample data");
    const sqlLoad = 
        "LOAD DATA LOCAL INFILE '~/Users/syy/cs348_project/server/UserInfo.txt' INTO TABLE UserInfo LINES TERMINATED BY '\r';";
})

app.post("/api/insert", (req, res) => {
    res.send("hello to backend world");
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;

    const sqlInsert = 
        "INSERT INTO UserInfo (userName, userEmail) VALUES (?,?);";
    db.query(sqlInsert, [userName, userEmail], (err, result) => {
        console.log(err);
    });
});

app.listen(3001, () => {
    console.log("running on port 3001");
});