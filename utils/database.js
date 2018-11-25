"use strict"
const mysql = require('mysql2')
const config = require('../config.json')

const pool = mysql.createPool({
  host: config.dbHost,
  user: config.dbUser,
  database: config.database,
  password: config.dbPassword
})

module.exports = pool.promise();
