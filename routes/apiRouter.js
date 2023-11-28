const { Router } = require("express")
const route = Router()
const { Students } = require("../models/mongo/students")
const Crudlogs = require("../models/postgres/crudlog")
const { Op } = require("sequelize")
const mangoose = require("mongoose")
const { readData } = require("../utils/mongooseUtils")

route.get("/api/v1/students", async (req, res) => {
  const search = req.query.search
  let data

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
    console.log(data)
  } else {
    data = await Students.findAll({
      //     where: {
      //       isRemoved: false,
      //      },
      attributes: {
        exclude: [
          "s_image_url",
          "isRemoved",
          //   ["s_id", "studentId"],
          //   ["s_firstname", "firstname"],
          //   ["s_lastname", "lastname"],
          //   ["s_birthdate", "birthdate"],
          //   ["s_emailid", "email"],
          //   ["s_class", "class"],
          //   ["s_image_url", "imageurl"],
        ],
      },
      order: [["s_id", "ASC"]],
    })
  }
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
      ["s_emailid", "email"],
      ["s_class", "class"],
      ["s_image_url", "imageurl"],
    ],
  })

  return res.status(200).json(data)
})

// route.get("/api/v1/logs", async (req, res) => {
//   const data = await Crudlogs.findAll({
//     attributes: [
//       ["user_id", "User ID"],
//       ["action_type", "Action"],
//       ["target_student_id", "Target ID"],
//       ["timestamp", "Timestamp"],
//     ],
//   })

//   return res.status(200).json(data)
// })

module.exports = route
