const express = require('express');
const app = express();
const mysql = require('mysql');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '20020912@Syy',
    database: 'CS348_Project',
})

app.get("/", (req, res) => {
    const sqlInsert = 
        "INSERT INTO userInfo (userName, userEmail) VALUES ('Elena', 'shiyunyi2002@outlook.com');";
    db.query(sqlInsert, (err, result) => {
        res.send("Hello to the server world, Elena!");
    });
});

app.listen(3001, () => {
    console.log("running on port 3001");
});