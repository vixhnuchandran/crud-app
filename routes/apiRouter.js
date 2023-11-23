const { Router } = require("express")
const route = Router()
const Students = require("../model/student")
const Crudlogs = require("../model/crudlog")
const Marks = require("../model/marks")
const { Op } = require("sequelize")

route.get("/api/v1/students", async (req, res) => {
  const search = req.query.search
  console.log(search)
  const data = await Students.findAll({
    where: {
      isRemoved: false,

      [Op.or]: [
        { s_firstname: { [Op.iLike]: `%${search}%` } },
        { s_lastname: { [Op.iLike]: `%${search}%` } },
        { s_emailid: { [Op.iLike]: `%${search}%` } },
      ],
    },
    attributes: [
      ["s_id", "studentId"],
      ["s_firstname", "firstname"],
      ["s_lastname", "lastname"],
      ["s_birthdate", "birthdate"],
      ["s_emailid", "email"],
      ["s_class", "class"],
      ["s_image_url", "imageurl"],
    ],
    order: [["s_id", "ASC"]],
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
      ["s_emailid", "email"],
      ["s_class", "class"],
      ["s_image_url", "imageurl"],
    ],
  })

  return res.status(200).json(data)
})

route.get("/api/v1/logs", async (req, res) => {
  const data = await Crudlogs.findAll({
    attributes: [
      ["user_id", "User ID"],
      ["action_type", "Action"],
      ["target_student_id", "Target ID"],
      ["timestamp", "Timestamp"],
    ],
  })

  return res.status(200).json(data)
})

module.exports = route
