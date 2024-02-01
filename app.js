const fastify = require('fastify')({bodyLimit: 5 * 1024 * 1024});
const path = require('path');
const { DateTime } = require('luxon');
const fs = require('fs/promises')
const util = require('node:util')
const { pipeline } = require('node:stream');
const { name } = require('ejs');
const pump = util.promisify(pipeline)

var dates, hours, time, fullTime;

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
    hours = DateTime.now().toFormat("HH:mm");
    time = DateTime.now().toFormat("HHmmssddMMyyyy");

    fullTime = `${dates} ${DateTime.now().toFormat("HH:mm:ss")}`;
}, 1000)

fastify.get('/', (req, res) => {
    res.redirect('/peminjaman-laptop')
})

fastify.get('/peminjaman-laptop', (req, res) => {
    res.view("/views/peminjaman-laptop.ejs", {
        time: `${dates} ${hours}`,
    })
})

fastify.get('/pengembalian-laptop', (req, res) => {
    res.view("/views/pengembalian-laptop.ejs", {
        time: `${dates}T${hours}`,
    })
})

fastify.post("/peminjaman-laptop", async (req, res) => {
    const files = await req.file();
    const data = Object.entries(files)[6][1];

    if(!files.mimetype.includes("image/jpeg")){
        return res.status(400).send({
            status: 400,
            error: "The specified file is not an image"
        });
    };
    const file = await files.toBuffer();
    const filename = `${time}.jpeg`;
    const fields = Object.values(files.fields)
    fields.find(f => f.fieldname === "kelas");
    var tanggal = fullTime;
    var tanggal, kelas, nama, nomorLaptop, tas, charger, mouse;
    
    for(const obj in data){
        if(data[obj].type === "field"){
            // console.log(data[obj])
            if (data[obj].fieldname === "kelas"){
                kelas = data[obj].value
            } else if (data[obj].fieldname === "nama"){
                nama = data[obj].value
            } else if (data[obj].fieldname === "nomorLaptop"){
                nomorLaptop = data[obj].value
            } else if (Object.values(data[obj]).includes("tas")){
                tas = true
            } else if (Object.values(data[obj]).includes("mouse")){
                mouse = true
            } else if (Object.values(data[obj]).includes("charger")){
                charger = true
            }
        } 
    }
    
    console.log(`${tanggal}, ${kelas}, ${nama}, ${nomorLaptop}, ${tas}, ${mouse}, ${charger}, ${filename}`)
    await fs.writeFile(`public/uploads/${filename}`, file);

    return {
        status: 200,
        message: "Success"
    }
})

fastify.listen({port:8000, host: "0.0.0.0"}, () => {
    console.log("Site running at port 8000");
})