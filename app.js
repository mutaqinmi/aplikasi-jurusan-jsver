const fastify = require('fastify')({bodyLimit: 5 * 1024 * 1024});
const path = require('path');
const { DateTime } = require('luxon');
const fs = require('fs/promises')

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

setInterval(() => {
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
    
    if(!files.mimetype.includes("image/jpeg")){
        return res.status(400).send({
            status: 400,
            error: "The specified file is not an image"
        });
    };

    const file = await files.toBuffer();
    const filename = `${time}.jpeg`;
    var tanggal = fullTime;

    const getValue = (data) => {
        const fields = Object.values(files.fields)
        const dataField = fields.find(result => result.fieldname === data);
        
        if(data = "tas"){
            if(dataField === undefined){
                return false;    
            } else {
                return true
            }
        } else if (data === "mouse"){
            if(dataField === undefined){
                return false;    
            } else {
                return true
            }
        } else if (data === "charger"){
            if(dataField === undefined){
                return false;    
            } else {
                return true
            }
        }

        return Object.values(dataField)[4];
    }
    
    const kelas = getValue("kelas");
    const nama = getValue("nama");
    const nomorLaptop = getValue("nomorLaptop");
    const tas = getValue("tas");
    const mouse = getValue("mouse");
    const charger = getValue("charger");

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