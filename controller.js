const express = require('express');
const app = express();
const date = new Date();

app.use(express.static(__dirname + "/public"))
app.set("views", __dirname + "/views")
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    const getMonth = ("0" + date.getMonth() + 1).slice(-2);
    const getDate = ("0" + date.getDate()).slice(-2);
    const getHours = ("0" + date.getHours()).slice(-2);
    const getMinutes = ("0" + date.getMinutes()).slice(-2);
    res.render("peminjaman-laptop", {
        time: `${date.getFullYear()}-${getMonth}-${getDate}T${getHours}:${getMinutes}`,
    });
})

app.use('/', (req, res) => {
    res.status(404);
    res.send("404");
})

module.exports.app = app;