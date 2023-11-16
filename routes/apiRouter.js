const { Router } = require("express")
const route = Router()
const path = require("path")
const fs = require("fs")
const Students = require("../model/student")

async function sendLogFIle(req, res, next) {
  try {
    const filePath = path.join(__dirname, "../access.log")
    fs.readFile(filePath, "utf-8", (err, data) => {
      return res.status(200).json({ logs: data.split("\n") })
    })
  } catch (error) {
    return res
      .status(500)
      .send({ message: `Internal Server Error", ${error.message}` })
  }
}

route.get("/api/v1/logs", sendLogFIle)

route.get("/api/v1/students", async (req, res) => {
  const data = await Students.findAll({
    where: { isRemoved: false },
    attributes: [
      ["s_id", "studentId"],
      ["s_firstname", "firstname"],
      ["s_lastname", "lastname"],
      ["s_birthdate", "birthdate"],
      ["s_contactno", "contact"],
      ["s_address", "address"],
      ["s_image_url", "imageurl"],
    ],
  })

  return res.status(200).json(data)
})

route.get("/api/v1/students/:sid", async (req, res) => {
  const sid = req.params.sid
  const data = await Students.findByPk(sid, {
    where: { isRemoved: false },
    attributes: [
      ["s_id", "studentId"],
      ["s_firstname", "firstname"],
      ["s_lastname", "lastname"],
      ["s_birthdate", "birthdate"],
      ["s_contactno", "contact"],
      ["s_address", "address"],
      ["s_image_url", "imageurl"],
    ],
  })

  return res.status(200).json(data)
})
module.exports = route
