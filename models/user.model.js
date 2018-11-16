"use strict"

const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const md5 = require('md5')


const db = require('../utils/database')
const config = require('../config.json')

module.exports = class UserModel{
  constructor(){}

  static hashPass(password) {

    try {
      const salt = await bcrypt.genSalt(10)

      return await bcrypt.hash(password, salt)

    } catch (error) {}

  }

  static comparePass(password, hash) {

    return await bcrypt.compare(password, hash)
  }

  static findUser(mail){

    try {

      const users = await db.execute(`CALL ${this.dbName}.findUserLogin(?)`, [mail])
      const user = users[0]

      return user
    } catch (error) {
      throw { validMail: false }
    }
  }

  static userExist(mail) {

    const users = await db.execute(`CALL ${this.dbName}.findUserRegister(?)`, [mail])

    return !!(users[0])
  }

  static login(){

    const user = await this.findUser(email)

    if (!user) throw { userExist: false }

    if (!user.verified) throw { activate: false }

    if (!await this.comparePassword(password, user.pass)) {

      throw { authenticated: false }
    }

    return user;
  }


   static register(user){

      try {
        const userExist = await this.userExist(user.email)

        if (userExist) {

          throw { userExist: true }
        }

        const currentDate = new Date();

        user.verificationCode = md5(`${user.email}${currentDate}`)
        user.pass = await this.hashPassword(user.pass)

        await db.execute(`CALL ${this.dbName}.createUser(?,?,?,?,?,?)`,
                          [user.userName, user.userSurname, user.email,
                          user.birthdate, user.pass, user.verificationCode])

        this.sendEmail(user.email, user.verificationCode)

        return { signedUp: true, msg: 'user successfully signed up' }

      } catch (err) {

        throw { ...err, userCreated: false };
      }
    }

    static verifyAccount(accountString) {

      try {
        const result = await db.execute(`CALL ${this.dbName}.verifyAccount(?)`, [accountString])

        if (result.changedRows !== 1) throw { activate: false, msg: 'invalid activation code' }

        return { activate: true }

      } catch (err) throw { activate: false }

    }

   static sendEmail(email, activationString) {

      nodemailer.createTestAccount((err, account) => {
        let transporter = nodemailer.createTransport({
          host: config.dbHost,
          port: config.port,
          secure: false,
          auth: {
            user: config.mailUser,
            pass: config.mailPass
          }
        })

        let mailOptions = {
          from: '"Social Penguin" <keamailer@gmail.com>',
          to: email,
          subject: 'Account activation',
          text: 'In order to activate your account you need to access the following link',
          html: `<b>In order to activate your account you need to access the following link</b> <a href="http://${config.host}:${config.port}/user/activation/${activationString}">Activation link</a>`
        }

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) throw { activationSent: false }
        })
      })
    }

  }

}
