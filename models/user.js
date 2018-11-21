"use strict"

const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const md5 = require('md5')


const db = require('../utils/database')
const config = require('../config.json')

module.exports = class UserModel{
  constructor(){}

   async hashPass(password) {

    try {
      const salt = await bcrypt.genSalt(10)

      return await bcrypt.hash(password, salt)

    } catch (error) {}

  }

  async findUser(mail){

    db.execute(`CALL securityDB.findUserRegister(?)`, [mail])
      .then(result => {
        console.log(result[0]);
      })
      .catch(err => {
        console.log(err);
      });


  }


  async login(email, password){

    var user;

    await db.execute(`CALL securityDB.findUserRegister(?)`, [email])
      .then(result => {

        user = {
          name: result[0][0][0].name,
          pass: result[0][0][0].pass,
          ID: result[0][0][0].ID,
          verified: result[0][0][0].verified
        }

      })
      .catch(err => {
        console.log(err);
      });

    console.log(user);

    if (typeof user == 'undefined') return false;
    if (!bcrypt.compareSync(password, user.pass)) {
        return false;
    }
    return user;
  }


  async register(user){

    const currentDate = new Date();

    user.verificationCode = md5(`${user.email}${currentDate}`)
    user.pass = await this.hashPass(user.pass)

    db.execute(`CALL securityDB.createUser(?,?,?,?)`,
                [user.name, user.email,
                user.pass, user.verificationCode])
      .then(result => {
        console.log("New user created with email " + user.email);
      })
      .catch(err => {
        console.log("User not created. Email already in use");
      });


    //this.sendEmail(user.email, user.verificationCode)

    }

    async verifyAccount(accountString) {

      try {
        const result = await db.execute(`CALL securityDB.verifyAccount(?)`, [accountString])

        if (result.changedRows !== 1) throw { activate: false, msg: 'invalid activation code' }

        return { activate: true }

      } catch (err) {throw { activate: false }

    }}

    // async sendEmail(email, activationString) {
    //
    //   nodemailer.createTestAccount((err, account) => {
    //     let transporter = nodemailer.createTransport({
    //       host: config.dbHost,
    //       port: config.port,
    //       secure: false,
    //       auth: {
    //         user: config.mailUser,
    //         pass: config.mailPass
    //       }
    //     })
    //
    //     let mailOptions = {
    //       from: '"Social Penguin" <keamailer@gmail.com>',
    //       to: email,
    //       subject: 'Account activation',
    //       text: 'In order to activate your account you need to access the following link',
    //       html: `<b>In order to activate your account you need to access the following link</b> <a href="http://${config.host}:${config.port}/user/activation/${activationString}">Activation link</a>`
    //     }
    //
    //     transporter.sendMail(mailOptions, (error, info) => {
    //       if (error) throw { activationSent: false }
    //     })
    //   })
    // }

  }
