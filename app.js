const fastify = require('fastify')();
const fs = require('fs');
const util = require('util');
const {pipeline} = require('node:stream')
const pump = util.promisify(pipeline);
const path = require('path');
const time = require('moment')();

fastify.register(require('@fastify/view'), {
    engine: {
        ejs: require('ejs'),
    },
});

fastify.register(require('@fastify/multipart'))

fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
})

fastify.get('/', (req, res) => {
    res.redirect('/peminjaman-laptop')
})

fastify.get('/peminjaman-laptop', (req, res) => {
    res.view("/views/peminjaman-laptop.ejs", {
        time: time.format("YYYY-MM-DDTHH:mm"),
    })
})

fastify.post("/peminjaman-laptop", (req, res) => {
    const files = req.files();

    console.log(files.filename);
    // pump(files.file, fs.createWriteStream(`public/uploads/${files.filename}`))
    // res.send("Ok")
})

fastify.listen({port:8000}, () => {
    console.log("Site running at port 8000");
})