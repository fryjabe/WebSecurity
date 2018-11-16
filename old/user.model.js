"use strict"

const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const md5 = require('md5')
//const logger = require('../logger')

const DBmodel = require('./db.model')

const config = require('../config.json')
//const logger = require('../logger')

class UserModel extends DBmodel {

  constructor() {
    super()
    //logger.debug(`ChatModel.constructor()`)
  }

  async hashPass(password) {

    //logger.info(`UserModel.hashPass()`)
    try {
      const salt = await bcrypt.genSalt(10)

      return await bcrypt.hash(password, salt)

    } catch (error) {
      //logger.error(`UserModel.hashPassword() -> failed to hash password ${error}`)

    }

  }

  async comparePass(password, hash) {
    //logger.info('UserModel.comparePassword()')
    return await bcrypt.compare(password, hash)
  }

  async findUser(mail){

    //logger.debug(`DbModel.findUserByEmail(${email})`)
    try {

      const users = await this.query(`CALL ${this.dbName}.findUserLogin(?)`, [mail])
      const user = users[0]

      //logger.info(`findUserByEmail(${email}) -> user found: ${JSON.stringify(user)}`)

      return user
    } catch (error) {
      //logger.error(`DbModel.findUserByEmail(${email}) -> ${JSON.stringify(error)}`)
      throw { validMail: false }
    }
  }

  async userExist(mail) {

    //logger.debug(`DbModel.userExist(${email})`)
    const users = await this.query(`CALL ${this.dbName}.findUserRegister(?)`, [mail])

    return !!(users[0])
  }

  async login(){


    //logger.debug(`UserModel.authenticateUser(${email}, ${password})`)
    const user = await this.findUser(email)

    if (!user) {
      //logger.warn(`UserModel.authenticateUser(${email}, ${password}) -> account not found!`)
      throw { userExist: false }
    }

    if (!user.verified) {
      //logger.warn(`UserModel.authenticateUser(${email}, ${password}) -> account is not activated`)
      throw { activate: false }
    }

    if (!await this.comparePassword(password, user.pass)) {
      //logger.warn(`UserModel.authenticateUser(${email}, ${password}) -> password comparison failed`)
      throw { authenticated: false }
    }

    //logger.info(`UserModel.authenticateUser(${email}, ${password}) -> password comparison succeeded`)
    return user;
  }

  async register(user){

    //logger.debug(`UserModel.createUser()`)
    try {
      const userExist = await this.userExist(user.email)

      if (userExist) {
        //logger.warn(`UserModel.createUser() -> email exist!: ${user.email}`)
        throw { userExist: true }
      }

      const currentDate = new Date();

      user.verificationCode = md5(`${user.email}${currentDate}`)
      user.pass = await this.hashPassword(user.pass)

      await this.query(`CALL ${this.dbName}.createUser(?,?,?,?,?,?)`,
                        [user.userName, user.userSurname, user.email,
                        user.birthdate, user.pass, user.verificationCode])

      this.sendEmail(user.email, user.verificationCode)

      return { signedUp: true, msg: 'user successfully signed up' }

    } catch (err) {
      //logger.error(`UserModel.CreateUser() -> create user failed: ${JSON.stringify(err)}`)
      throw { ...err, userCreated: false };
    }
  }

  async verifyAccount(accountString) {
    //logger.debug(`UserModel.activateAccount(${accountString}`)
    try {
      const result = await this.query(`CALL ${this.dbName}.verifyAccount(?)`, [accountString])

      if (result.changedRows !== 1) {

        //logger.error(`UserModel.activateAccount(${accountString}) -> activation failed`)

        throw { activate: false, msg: 'invalid activation code' }

      }

      //logger.info(`UserModel.activateAccount() -> account activated`)

      return { activate: true }

    } catch (err) {
      //logger.error(`UserModel.activateAccount() -> activation failed: ${JSON.stringify(err)}`)
      throw { activate: false }
    }
  }

  sendEmail(email, activationString) {
    //logger.debug(`UserModel.sendEmail(${email}, ${activationString})`)
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
        if (error) {
          //logger.error(`UserModel.sendEmail() -> Failed to send activation code to user email: ${JSON.stringify(error)}`)
          throw { activationSent: false }
        }
      })
    })
  }

}
