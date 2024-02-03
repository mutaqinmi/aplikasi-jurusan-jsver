// ------------------------- Modules and Plugins -------------------------
const { fastify, path } = require('./app/modules');
const controller = require('./app/controller');
const mysql = require('./app/database');
fastify.register(require('@fastify/view'), {
    engine: {
        ejs: require('ejs'),
    },
});
fastify.register(require('@fastify/multipart'))
fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
})

// ------------------------- API Routes -------------------------
fastify.get('/api/data-peminjaman/data-nama/:nomorLaptop?', async (req, res) => {
    const { nomorLaptop } = req.params;
    const dataPeminjaman = await mysql.selectData("data_peminjaman", "*", `WHERE nomor_laptop = '${nomorLaptop}'`);
    const dataSiswa = await mysql.selectData("data_siswa", "*", `WHERE nis = '${dataPeminjaman[0].nis}'`)

    return {
        dataSiswa: dataSiswa,
    }
})

// ------------------------- Application Routes -------------------------
fastify.get('/', async (req, res) => {
    await res.redirect('/peminjaman-laptop')
})

fastify.get('/peminjaman-laptop', async (req, res) => {
    const dataSiswa = await mysql.selectData("data_siswa", "*");
    const dataLaptop = await mysql.selectData("data_laptop", "*", "WHERE dipinjam = '0'");

    await res.view("/views/peminjaman-laptop.ejs", {
        dataSiswa: dataSiswa,
        dataLaptop: dataLaptop,
    })
})

fastify.get('/pengembalian-laptop', async (req, res) => {
    const dataLaptop = await mysql.selectData("data_laptop", "*", "WHERE dipinjam = '1'");

    await res.view("/views/pengembalian-laptop.ejs", {
        dataLaptop: dataLaptop,
    })
})

fastify.post("/peminjaman-laptop", async (req, res) => {
    const files = await req.file();
    if(!files.mimetype.includes("jpeg" || "jpg")){
        res.status(400).send({
            status: 400,
            messages: "Files is not an image",
        })
    }

    controller.peminjaman(files);

    setTimeout(() => {
        res.redirect(200, "/peminjaman-laptop");
    }, 2000);

    // return {
    //     status: 200,
    //     message: "Success"
    // }
})

// ------------------------- Server -------------------------
fastify.listen({port: process.env.PORT, host: process.env.HOST}, () => {
    console.log(`Site running at port ${fastify.server.address().port}`);
})