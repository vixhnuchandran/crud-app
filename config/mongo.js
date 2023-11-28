const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async function () {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(data => {
      console.log("Database connected successfully")
    })
    .catch(error => {
      console.log("Error occurred while connecting databse: ", error)
    })
}

module.exports = connectDB
