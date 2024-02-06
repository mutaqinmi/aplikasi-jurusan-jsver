//* ------------------------- Modules and Plugins -------------------------
const { fastify, path } = require('./app/modules');
const controller = require('./app/controller');
const mysql = require('./app/database');
fastify.register(require('@fastify/view'), {
    engine: {
        ejs: require('ejs'),
    },
});
fastify.register(require('@fastify/multipart'), {attachFieldsToBody: 'true'})
fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
})
fastify.register(require('@fastify/session'));
fastify.register(require('@fastify/cookie'));

//* ------------------------- API Routes -------------------------
fastify.get('/api/data-peminjaman/data-nama/:nomorLaptop(^\\d+)', async (req, res) => {
    const { nomorLaptop } = req.params;
    const dataPeminjaman = await mysql.selectData("data_peminjaman", "*", `WHERE nomor_laptop = '${nomorLaptop}' ORDER BY tanggal_peminjaman DESC`);
    const dataSiswa = await mysql.selectData("data_siswa", "*", `WHERE nis = '${dataPeminjaman[0].nis}'`)

    return {
        dataSiswa: dataSiswa,
    }
})

//* ------------------------- Application Routes -------------------------
//= GET
fastify.get('/', async (req, res) => {
    await res.view('/views/home.ejs');
})

fastify.get('/admin-login', async (req, res) => {
    await res.view("/views/login.ejs");
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

//= POST
fastify.post("/admin-login", async (req, res) => {
    const data = await req.file();

    //TODO npm install @fastify/formbody
    //! console.log(files);

    const result = await controller.login(data);

    if(!result[0]){
        return res.status(400).view("/views/error.ejs", {
            status: 400,
            statusDesc: "ERROR",
            title: "Error!",
            message: "Username tidak tersedia!",
            redirectURL: "/admin-login",
        })
    } else {
        if(controller.getValue(data, "password") === result[0].password){
            return res.status(200).view("/views/success.ejs", {
                status: 200,
                statusDesc: "OK",
                title: "Success!",
                message: "Login Berhasil!",
                redirectURL: "/",
            })
        } else {
            return res.status(400).view("/views/error.ejs", {
                status: 400,
                statusDesc: "ERROR",
                title: "Error!",
                message: "Password Salah!",
                redirectURL: "/admin-login",
            })
        }
    }    
})

fastify.post("/peminjaman-laptop", async (req, res) => {
    const files = await req.file();
    if(!files.mimetype.includes("jpeg"|| "jpg")){
        res.status(400).view("/views/error.ejs", {
            status: 400,
            statusDesc: "ERROR",
            title: "Error!",
            message: "File yang diunggah bukan gambar/format ekstensi .jpeg!",
            redirectURL: "/",
        })
    }

    controller.peminjaman(files);

    return res.status(200).view("/views/success.ejs", {
        status: 200,
        statusDesc: "OK",
        title: "Success!",
        message: "Data peminjaman laptop berhasil diunggah!",
        redirectURL: "/",
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
            redirectURL: "/",
        })
    }

    controller.pengembalian(files);

    return res.status(200).view("/views/success.ejs", {
        status: 200,
        statusDesc: "OK",
        title: "Success!",
        message: "Data pengembalian laptop berhasil diunggah!",
        redirectURL: "/",
    })
})

//* ------------------------- Server -------------------------
fastify.listen({port: process.env.PORT}, () => {
    console.log(`Site running at port ${fastify.server.address().port}`);
})