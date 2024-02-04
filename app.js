//* ------------------------- Modules and Plugins -------------------------
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

//* ------------------------- API Routes -------------------------
// TODO: Buat parameter menjadi integer only
fastify.get('/api/data-peminjaman/data-nama/:nomorLaptop(^\\d+)', async (req, res) => {
    const { nomorLaptop } = req.params;
    const dataPeminjaman = await mysql.selectData("data_peminjaman", "*", `WHERE nomor_laptop = '${nomorLaptop}' ORDER BY tanggal_peminjaman DESC`);
    const dataSiswa = await mysql.selectData("data_siswa", "*", `WHERE nis = '${dataPeminjaman[0].nis}'`)

    return {
        dataSiswa: dataSiswa,
    }
})

//* ------------------------- Application Routes -------------------------
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

    await res.status(200).view("/views/success.ejs", {
        status: 200,
        statusDesc: "OK",
        title: "Success!",
        message: "Data peminjaman laptop berhasil diunggah!",
    })
})

fastify.post("/pengembalian-laptop", async (req, res) => {
    const files = await req.file();
    if(!files.mimetype.includes("jpeg"|| "jpg")){
        res.status(400).view("/views/error.ejs", {
            status: 400,
            statusDesc: "ERROR",
            title: "Error!",
            message: "File yang diunggah bukan gambar/format ekstensi .jpeg!",
        })
    }

    controller.pengembalian(files);

    await res.status(200).view("/views/success.ejs", {
        status: 200,
        statusDesc: "OK",
        title: "Success!",
        message: "Data pengembalian laptop berhasil diunggah!",
    })
})

//* ------------------------- Server -------------------------
fastify.listen({port: process.env.PORT}, () => {
    console.log(`Site running at port ${fastify.server.address().port}`);
})