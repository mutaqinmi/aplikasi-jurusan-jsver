const { fs, datetime } = require('./modules');

var dates, hours, time, fullTime;
setInterval(() => {
    dates = datetime.now().toFormat("yyyy-MM-dd");
    hours = datetime.now().toFormat("HH:mm");
    time = datetime.now().toFormat("HHmmssddMMyyyy");

    fullTime = `${dates} ${datetime.now().toFormat("HH:mm:ss")}`;
}, 1000)


const pinjam = async (files) => {
    const image = await files.toBuffer();
    const filename = `${time}.jpeg`;
    var tanggal = fullTime;

    console.log(filename);
    
    const getValue = (files, data) => {
        const fields = Object.values(files.fields)
        const dataField = fields.find(result => result.fieldname === data);
        
        if(dataField === undefined){
            if(data === "tas"){
                if(dataField === undefined){
                    return false;    
                }
            } else if (data === "mouse"){
                if(dataField === undefined){
                    return false;    
                }
            } else if (data === "charger"){
                if(dataField === undefined){
                    return false;    
                }
            }

            return false
        }
    
        return Object.values(dataField)[4];
    }
    
    const kelas = getValue(files, "kelas");
    const nama = getValue(files, "nama");
    const nomorLaptop = getValue(files, "nomorLaptop");
    const tas = getValue(files, "tas") === "on" ? true : false;
    const mouse = getValue(files, "mouse") === "on" ? true : false;
    const charger = getValue(files, "charger") === "on" ? true : false;

    console.log(`${tanggal}, ${kelas}, ${nama}, ${nomorLaptop}, ${tas}, ${mouse}, ${charger}, ${filename}`)
    await fs.writeFile(`public/uploads/${filename}`, image);
}

module.exports = {
    pinjam,
}