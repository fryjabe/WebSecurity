"use strict"


const db = require('../utils/database')
const config = require('../config.json')

module.exports = class PostModel{
  constructor(){}


  static feed(userID){
    return db.execute(`CALL ${config.database}.showFeed(?)`,[userID]))
  }

  static createPost(post){
    return db.execute(`CALL ${config.database}.createUser(?,?,?,?)`,
                    [post.userID, post.caption, post.link, post.postType]))

  }
}
