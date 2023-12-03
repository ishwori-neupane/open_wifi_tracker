const mysql = require("mysql");
require('dotenv').config()
// const db = require('db')
// db.connect({
//   host: process.env.DB_HOST,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASS
// })
const connection = mysql.createConnection({
    database:process.env.DATABASE,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD

});

module.exports={
    connection
}