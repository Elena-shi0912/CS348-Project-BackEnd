const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '20020912@Syy',
    database: 'CS348_Project',
})

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended : true}));

app.post("/api/insert", (req, res) => {
    res.send("hello to backend world");
    const userName = req.body.userName;
    const userEmail = req.body.userEmail;

    const sqlInsert = 
        "INSERT INTO userInfo (userName, userEmail) VALUES (?,?);";
    db.query(sqlInsert, [userName, userEmail], (err, result) => {
        console.log(err);
    });
});

app.listen(3001, () => {
    console.log("running on port 3001");
});