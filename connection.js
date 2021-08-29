var mysql = require('mysql')

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'project_shopping'
})


conn.connect(function (err) {
    if (err) throw  err;
    console.log("connection created")
})

module.exports = conn
