// ------------------------- Module -------------------------
const { fs, datetime } = require('./modules');
const mysql = require('./database')

// ------------------------- Get Time Data -------------------------
var dates, hours, time, fullTime;
setInterval(() => {
    dates = datetime.now().toFormat("yyyy-MM-dd");
    hours = datetime.now().toFormat("HH:mm");
    time = datetime.now().toFormat("HHmmssddMMyyyy");

    fullTime = `${dates} ${datetime.now().toFormat("HH:mm:ss")}`;
}, 1000)


// ------------------------- Getting Form Value -------------------------
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

// ------------------------- Controller -------------------------
const peminjaman = async (files) => {
    const image = await files.toBuffer();
    const nama = getValue(files, "nama");
    const nomorLaptop = getValue(files, "nomorLaptop");
    const tas = getValue(files, "tas") === "on" ? 1 : 0;
    const mouse = getValue(files, "mouse") === "on" ? 1 : 0;
    const charger = getValue(files, "charger") === "on" ? 1 : 0;
    const filename = `${nama}-peminjaman-${time}.jpeg`;

    mysql.insertData("data_peminjaman", `NULL, '${nama}', '${nomorLaptop}', '${fullTime}', '${tas}', '${mouse}', '${charger}', '${filename}'`);
    await fs.writeFile(`public/uploads/${filename}`, image);

    mysql.updateData("data_laptop", "dipinjam = 1", `nomor_laptop = ${nomorLaptop}`);
}

const pengembalian = async (files) => {
    const image = files.toBuffer();
    const nomorLaptop = getValue(files, "nomorLaptop");
    const nama = getValue(files, "nama");
    const tas = getValue(files, "tas") === "on" ? 1 : 0;
    const mouse = getValue(files, "mouse") === "on" ? 1 : 0;
    const charger = getValue(files, "charger") === "on" ? 1 : 0;
    const filename = `${nama}-pengembalian-${time}.jpeg`;

    mysql.insertData("data_pengembalian", `NULL, '${nama}', '${nomorLaptop}', '${tas}', '${mouse}', '${charger}', '${filename}'`);
    await fs.writeFile(`public/uploads/${filename}`, image);

    mysql.updateData("data_laptop", "dipinjam = 0", `nomor_laptop = ${nomorLaptop}`);
}

// ------------------------- Export Module -------------------------
module.exports = {
    peminjaman,
    pengembalian,
}