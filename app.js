const { fastify, path, dates, hours } = require('./modules');
const controller = require('./controller');
const mysql = require('./database');
fastify.register(require('@fastify/view'), {
    engine: {
        ejs: require('ejs'),
    },
});
fastify.register(require('@fastify/multipart'))
fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
})

fastify.get('/', async (req, res) => {
    await res.redirect('/peminjaman-laptop')
})

fastify.get('/peminjaman-laptop', async (req, res) => {
    const rowDataKelas = await mysql.selectDataColumnResult("data_kelas", "nama_kelas");
    const dataKelas = Object.values(JSON.parse(JSON.stringify(rowDataKelas)));
    const rowDataNama = await mysql.selectDataColumnResult("data_siswa", "nama");
    const dataNama = Object.values(JSON.parse(JSON.stringify(rowDataNama)));

    await res.view("/views/peminjaman-laptop.ejs", {
        time: `${dates} ${hours}`,
        dataKelas: dataKelas,
        dataNama: dataNama,
    })
})

fastify.get('/pengembalian-laptop', async (req, res) => {
    await res.view("/views/pengembalian-laptop.ejs", {
        time: `${dates} ${hours}`,
    })
})

fastify.post("/peminjaman-laptop", async (req, res) => {
    const files = await req.file();

    controller.pinjam(files);

    return {
        status: 200,
        message: "Success"
    }
})

fastify.listen({port:process.env.PORT, host: process.env.HOST}, () => {
    console.log(`Site running at port ${fastify.server.address().port}`);
})