const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const { connectDB } = require("./config/postgres")
require("dotenv").config()

const app = express()

// assign routes
const webRoutes = require("./routes/webRoutes")
const apiRoutes = require("./routes/apiRouter")

// connect database
connectDB()

//middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

// static files
app.use("/logs", express.static(path.resolve(__dirname, "logs")))
app.use("/css", express.static(path.resolve(__dirname, "public/styles")))
app.use("/img", express.static(path.resolve(__dirname, "public/images")))
app.use("/js", express.static(path.resolve(__dirname, "public/scripts")))

// load routes
app.use("/", apiRoutes)
app.use("/", webRoutes)

// error handle
// app.use((err, req, res, next) => {
//   console.error(err.stack)
//   next()
// })

//start server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})
