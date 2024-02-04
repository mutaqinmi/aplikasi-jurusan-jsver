//* ------------------------- Module -------------------------
const { mysql } = require('./modules');

//* ------------------------- Connection -------------------------
const conn = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

//* ------------------------- Promise Function -------------------------
const selectDataColumn = (table, column, params) => {
    return new Promise((resolve) => {
        conn.query(`SELECT ${column} FROM ${table} ${params}`, function (err, results) {
            resolve(results);
        })
    })
}

const insertDataColumn = (table, params) => {
    return new Promise((resolve) => {
        conn.query(`INSERT INTO ${table} VALUES (${params})`, function (err, results) {
            resolve(results);
        })
    })
}

const updateDataColumn = (table, params, id) => {
    return new Promise((resolve) => {
        conn.query(`UPDATE ${table} SET ${params} WHERE ${id}`, function (err, results) {
            resolve(results);
        })
    })
}

//* ------------------------- Calling Promises -------------------------
const selectData = async (table, column, params) => {
    const data = await selectDataColumn(table, column, params);
    return Object.values(JSON.parse(JSON.stringify(data)));
}

const insertData = async (table, params) => {
    const data = await insertDataColumn(table, params);
}

const updateData = async (table, params, id) => {
    await updateDataColumn(table, params, id);
}

//* ------------------------- Export Modules -------------------------
module.exports = {
    conn,
    selectData,
    insertData,
    updateData,
};