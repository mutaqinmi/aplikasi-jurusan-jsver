const fastify = require('fastify')();
const fs = require('fs/promises');
const util = require('util');
const { pipeline } = require('node:stream')
const pump = util.promisify(pipeline);
const path = require('path');
const { error } = require('console');
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

fastify.post("/peminjaman-laptop", async (req, res) => {
    const files = await req.file();

    if (!files.mimetype.includes("image/jpeg")) {
        return res.status(400).send({
            status: 400,
            error: "The specified file is not an image"
        });
    }

    // await files.file.read()

    // await files.toBuffer()


    const file = await files.file.read();

    await fs.writeFile(`public/uploads/${time.format("HHmmDDMMYYYY")}${files.filename.endsWith("jpeg") ? "" : ".jpeg"}`, file);

    return {
        status: 200,
        message: "Success"
    }
})

fastify.listen({port:8000, host: "0.0.0.0"}, () => {
    console.log("Site running at port 8000");
})