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


  async register(user) {
    try {
      const currentDate = new Date();

      user.verificationCode = md5(`${user.email}${currentDate}`);
      user.pass = await this.hashPass(user.pass);

      db.execute(`CALL securityDB.createUser(?,?,?,?)`, [
        user.name,
        user.email,
        user.pass,
        user.verificationCode
      ]);

      console.log("New user created with email " + user.email);

      this.sendEmail(user.email, user.verificationCode);
      return { message: "account has been created", user: user.email };
    } catch (err) {
      console.log("User not created. Email already in use");
    }
  }

    async activateAccount(accountString) {

      db.execute(`CALL securityDB.verifyAccount(?)`, [accountString])
            .then(result => {
                console.log("User has been verified");
            })
            .catch(err => {
                console.log("User not verified in correct code");
            });

    }

    async sendEmail(email, activationString) {

        nodemailer.createTestAccount((err, account) => {
            let transporter = nodemailer.createTransport({
                // host: config.dbHost,
                // port: config.port,
                service:'gmail',
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
                html: `<b>In order to activate your account you need to access the following link</b> <a href="http://${config.host}:${config.port}/users/activation/${activationString}">Activation link</a>`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) throw { activationSent: false }
            })
        })
    }

  }
