const { mysql } = require('./modules');
const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

const selectDataColumn = (table, column) => {
    return new Promise((resolve) => {
        conn.query(`SELECT ${column} FROM ${table}`, function (err, results) {
            resolve(results)
        })
    })
}

const selectData = (table, params) => {
    return new Promise((resolve) => {
        conn.query(`SELECT * FROM ${table} WHERE ?=?`, params, function (err, results) {
            resolve(results)
        })
    })
}

const selectDataColumnResult = async (table, column) => {
    const data = await selectDataColumn(table, column);
    return data
}

const selectDataResult = async (table, params) => {
    const data = await selectData(table, params);
    return data
}

module.exports = {
    conn,
    selectDataColumnResult,
    selectDataResult
};