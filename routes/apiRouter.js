const { Router } = require("express")
const route = Router()
const { Students } = require("../models/mongo/students")

route.get("/api/v1/students", async (req, res) => {
  const search = req.query.search
  let data
  try {
    if (search) {
      data = await Students.find({
        isRemoved: false,
        $or: [
          { s_firstname: { $regex: new RegExp(search, "i") } },
          { s_lastname: { $regex: new RegExp(search, "i") } },
          { s_emailid: { $regex: new RegExp(search, "i") } },
        ],
      }).select({
        studentId: "$s_id",
        firstname: "$s_firstname",
        lastname: "$s_lastname",
        birthdate: "$s_birthdate",
        email: "$s_emailid",
        class: "$s_class",
        imageurl: "$s_image_url",
      })
    } else {
      data = await Students.find({
        isRemoved: false,
      })
        .select({
          studentId: "$s_id",
          firstname: "$s_firstname",
          lastname: "$s_lastname",
          birthdate: "$s_birthdate",
          email: "$s_emailid",
          class: "$s_class",
          imageurl: "$s_image_url",
        })
        .sort({ s_id: 1 })
    }
    if (data.length > 0) {
      return res.status(200).json(data)
    } else {
      return res.json({ message: "No matching records found" })
    }
  } catch (error) {}
})

route.get("/api/v1/students/:sid", async (req, res) => {
  const sid = req.params.sid
  const data = await Students.findOne({
    isRemoved: false,
    s_id: sid,
  }).select({
    studentId: "$s_id",
    firstname: "$s_firstname",
    lastname: "$s_lastname",
    birthdate: "$s_birthdate",
    email: "$s_emailid",
    class: "$s_class",
    imageurl: "$s_image_url",
  })

  return res.status(200).json(data)
})

module.exports = route
