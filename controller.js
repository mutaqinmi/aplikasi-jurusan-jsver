const express = require('express');
const ejs = require('ejs')
const fs = require('fs');
const app = express();
const date = new Date();

app.use(express.static(__dirname + "/public"))
app.set("views", __dirname + "/views")
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render("peminjaman-laptop", {
        time: `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}T0${date.getHours()}:${date.getMinutes()}`,
    });
})

app.use('/', (req, res) => {
    res.status(404);
    res.send("404");
})

module.exports.app = app;