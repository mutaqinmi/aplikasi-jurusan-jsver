const fastify = require('fastify')({bodyLimit: 30 * 1024 * 1024});
const fs = require('fs/promises');
const util = require('util');
const { pipeline } = require('node:stream')
const pump = util.promisify(pipeline);
const path = require('path');
const { error } = require('console');
const { DateTime } = require('luxon');
var dates, hours, time;

fastify.register(require('@fastify/view'), {
    engine: {
        ejs: require('ejs'),
    },
});

fastify.register(require('@fastify/multipart'))

fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
})

const timeInterval = setInterval(() => {
    dates = DateTime.now().toFormat("yyyy-MM-dd");
    hours = DateTime.now().toFormat("hh:mm");
    time = DateTime.now().toFormat("hhmmssddMMyyyy");
}, 1000)

fastify.get('/', (req, res) => {
    res.redirect('/pengembalian-laptop')
})

fastify.get('/peminjaman-laptop', (req, res) => {
    res.view("/views/peminjaman-laptop.ejs", {
        time: `${dates}T${hours}`,
    })
})

fastify.post("/peminjaman-laptop", async (req, res) => {
    const files_peminjaman = await req.file();

    if (!files_peminjaman.mimetype.includes("image/jpeg")) {
        return res.status(400).send({
            status: 400,
            error: "The specified file is not an image"
        });
    }

    const file_peminjaman = await files_peminjaman.toBuffer();
    
    await fs.writeFile(`public/uploads/foto-peminjaman/${time}${files_peminjaman.filename.endsWith("jpeg") ? "" : ".jpeg"}`, file_peminjaman);

    return {
        status: 200,
        message: "Success"
    }
})

fastify.get('/pengembalian-laptop', (req, res) => {
    res.view("/views/pengembalian-laptop.ejs", {
        time: `${dates}T${hours}`,
    })
})

fastify.post("/pengembalian-laptop", async (req, res) => {
    const files_pengembalian = await req.file();

    if (!files_pengembalian.mimetype.includes("image/jpeg")) {
        return res.status(400).send({
            status: 400,
            error: "The specified file is not an image"
        });
    }

    const file_pengembalian = await files_pengembalian.toBuffer();
    
    await fs.writeFile(`public/uploads/foto-pengembalian/${time}${files_pengembalian.filename.endsWith("jpeg") ? "" : ".jpeg"}`, file_pengembalian);

    return {
        status: 200,
        message: "Success"
    }
})

fastify.listen({port:8000, host: "0.0.0.0"}, () => {
    console.log("Site running at port 8000");
})