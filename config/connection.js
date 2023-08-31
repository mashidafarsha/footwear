let env=require('dotenv')
const mongoose = require("mongoose");
env.config()

let dbinit = {
  init:()=>{

    mongoose.connect(process.env.MONGO_URL)
    const db = mongoose.connection;
   
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
      console.log("Connected successfully");
    });
  }
}
module.exports = dbinit