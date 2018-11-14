"use strict"

//const logger = require('../logger')

const DBmodel = require('./db.model')

class PostModel extends DBmodel {

  constructor() {
    super()
    //logger.debug(`ChatModel.constructor()`)
  }

  async feed(userID){

    //logger.debug(`ChatModel.insertMessage(${JSON.stringify(data)})`)
    return await this.query(`CALL ${this.dbName}.showFeed(?)`,[userID]))
  }

  async createPost(post){

    //logger.debug(`ChatModel.insertMessage(${JSON.stringify(data)})`)
    return await this.query(`CALL ${this.dbName}.createUser(?,?,?,?)`,
                      [post.userID, post.caption, post.link, post.postType]))

  }

}
