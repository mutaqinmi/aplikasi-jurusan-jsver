const express = require('express');
const fs = require('fs');

const app = express();

app.get('/', (req, res) => {
    res.status(200).send("Hello");
})

app.listen(8000, () => {
    console.log("Site running at port 8000");
})