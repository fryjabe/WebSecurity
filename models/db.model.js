"use strict"
const mysql = require('mysql')

const config = require('../config.json')

//const logger = require('../logger')

class DBmodel {

  constructor() {

    this.dbName = 'securityDB'
  }

  get conn() {

    return this.createConn()
  }


  createConn() {

    try {
      return new Promise((resolve, reject) => {

        // TODO: Pool the connection instead of creating a new one
        const connection = mysql.createConnection({
          host: config.dbHost,
          user: config.dbUser,
          password: config.dbPassword
        })

        connection.connect((err) => {
          if (err) {

            //logger.error(`DbModule.createConn() -> connecting to database failed ${JSON.stringify, err}`)
            return reject({ dbConnected: false })
          }

          //logger.info('DbModel.createConn() -> connecting to database Succeed')
          return resolve(connection)
        })
      })

    } catch (error) {
      //logger.error(`DB.createConn() -> Failed to connect to database ${JSON.stringify(error)}`);
    }

  }

  query(sql, data = []) {
    return new Promise(async (resolve, reject) => {
      const conn = await this.conn

      conn.query(sql, data, (err, result) => {

        //Close connection after query
        conn.end()

        if (err) {
          //logger.error(`DbModel.query() query failed-> ${JSON.stringify(err)}`)
          return reject({ querySucceed: false })
        }

        //logger.info(`DbModel.query() query succeeded-> ${JSON.stringify(result)}`)
        return resolve(result)

      })
    })
  }

}

module.exports = DBmodel
