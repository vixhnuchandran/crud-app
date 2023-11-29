const mongoose = require("mongoose")
require("dotenv").config()

const connectDBM = async function () {
  mongoose
    .connect(process.env.MONGODB_URL, {})
    .then(data => {
      console.log("Database connected successfully")
    })
    .catch(error => {
      console.log("Error occurred while connecting databse: ", error)
    })
}

module.exports = { connectDBM }
