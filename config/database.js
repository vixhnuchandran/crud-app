const pg = require("pg")
const { Sequelize } = require("sequelize")
require("dotenv").config()
const sequelize = new Sequelize(process.env.POSTGRES_URL + "?sslmode=require", {
  dialect: "postgres",
})

const connectDB = async function () {
  try {
    await sequelize.authenticate()
    console.log(`Connection has been established successfully`)
  } catch (error) {
    console.error(`Unable to connect to the database, ${error.message}`)
  }
}

module.exports = { connectDB, sequelize }
