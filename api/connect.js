const mongoose = require("mongoose")
require("dotenv").config()

const DbConnect = (PATH) => {
  mongoose.connect(PATH)
  .then(() => console.log("Connection to database done")) 
  .catch((err) => console.log(err))
}

module.exports = DbConnect