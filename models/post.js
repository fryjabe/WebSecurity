"use strict"


const db = require('../utils/database')
const config = require('../config.json')

module.exports = class PostModel{
  constructor(){}


  async feed(){

    var feed;

    await db.execute(`CALL securityDB.showFeed()`)
    .then(result =>{
      feed = result[0][0]
    })
    .catch(err=>{
      console.log(err);
    });

    //console.log(feed);

    return feed;
  }

  static createPost(post){
    db.execute(`CALL securityDB.createPost(?,?,?,?)`,
                [post.userID, post.caption, post.link, post.postType])
                .then(result =>{
                  console.log("New post created be user with ID " + post.userID);
                })
                .catch(err =>{
                  console.log(err);
                });

  }
}
