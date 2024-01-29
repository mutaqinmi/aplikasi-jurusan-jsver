const express = require('express');
const app = express();

app.use(express.static(__dirname + "/public"))
app.set("views", __dirname + "/views")
app.set("view engine", "ejs");

class Time {
    date = new Date();
    
    getYear(){
        return this.date.getFullYear();
    }
    
    getMonth(){
        return ("0" + this.date.getMonth() + 1).slice(-2);
    }

    getDate(){
        return ("0" + this.date.getDate()).slice(-2);
    }

    getHours(){
        return ("0" + this.date.getHours()).slice(-2);
    }

    getMinutes(){
        return ("0" + this.date.getMinutes()).slice(-2);
    }
}

const time = new Time();
const getTime = `${time.getYear()}-${time.getMonth()}-${time.getDate()}T${time.getHours()}:${time.getMinutes()}`;

app.get('/', (req, res) => {
    res.redirect('/peminjaman-laptop')
})

app.get('/peminjaman-laptop', (req, res) => {
    res.render("peminjaman-laptop", {
        time: getTime,
    });
})

app.get('/pengembalian-laptop', (req, res) => {
    res.render("pengembalian-laptop", {
        time: getTime,
    });
})

app.use('/', (req, res) => {
    res.status(404);
    res.send("404");
})

app.listen(8000, () => {
    console.log("Site running at port 8000");
})