const fastify = require('fastify')({bodyLimit: 5 * 1024 * 1024});
const path = require('path');
const { DateTime } = require('luxon');
const fs = require('fs/promises')
const util = require('node:util')
const { pipeline } = require('node:stream');
const { name } = require('ejs');
const pump = util.promisify(pipeline)

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
    hours = DateTime.now().toFormat("HH:mm");
    time = DateTime.now().toFormat("HHmmssddMMyyyy");
}, 1000)

fastify.get('/', (req, res) => {
    res.redirect('/peminjaman-laptop')
})

fastify.get('/peminjaman-laptop', (req, res) => {
    res.view("/views/peminjaman-laptop.ejs", {
        time: `${dates}T${hours}`,
    })
})

fastify.get('/pengembalian-laptop', (req, res) => {
    res.view("/views/pengembalian-laptop.ejs", {
        time: `${dates}T${hours}`,
    })
})

fastify.post("/peminjaman-laptop", async (req, res) => {
    const files = await req.file();
    
    if(!files.mimetype.includes("image/jpeg")){
        return res.status(400).send({
            status: 400,
            error: "The specified file is not an image"
        });
    };
    const file = await files.toBuffer();
    const filename = `${time}${files.filename.endsWith("jpeg") ? "" : ".jpeg"}`;
    var kelas, nama, nomorLaptop, tas, charger, mouse;
    
    const data = Object.entries(files)[6][1];
    for(const obj in data){
        // console.log(obj)
        if(data[obj].type === "field"){

            console.log(Object.values(data[obj]).includes("tas"))
            // console.log(data[obj])
            if (data[obj].fieldname === "kelas"){
                kelas = data[obj].value
            } else if (data[obj].fieldname === "nama"){
                nama = data[obj].value
            } else if (data[obj].fieldname === "nomorLaptop"){
                nomorLaptop = data[obj].value
            } else if (data[obj].fieldname === "tas"){
                tas = true
            } else if (data[obj].fieldname === "mouse"){
                mouse = true
            } else if (data[obj].fieldname === "charger"){
                charger = true
            }
            // console.log(`${data[obj].fieldname}: ${data[obj].value}`)
        } 
    }

    console.log(`${kelas}, ${nama}, ${nomorLaptop}, ${tas}, ${mouse}, ${charger}, ${filename}`)
    await fs.writeFile(`public/uploads/${filename}`, file);

    return {
        status: 200,
        message: "Success"
    }
})

fastify.listen({port:8000, host: "0.0.0.0"}, () => {
    console.log("Site running at port 8000");
})