const { put } = require("@vercel/blob")
const Students = require("../model/student")
const Crudlogs = require("../model/crudlog")
const sharp = require("sharp")
require("dotenv").config()

const URL = process.env.BASE_URL

// dashboard
exports.dashboard = async (req, res) => {
  if (!req.auth.userId) {
    return res.render("dashboardError")
  } else {
    try {
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
        order: [["s_id", "ASC"]],
      })

      const students = data.map(student => student.toJSON())

      return res.render("dashboard", { students })
    } catch (error) {
      console.log(error.stack)
      return
    }
  }
}

//
// error page
exports.error = (req, res) => {
  return res.render("error")
}

//
// home page
exports.home = (req, res) => {
  return res.render("home")
}

//
//about page
exports.about = (req, res) => {
  return res.render("about")
}

//
//create page
exports.create = (req, res) => {
  return res.render("create", { heading: "New Student" })
}

//
// update form page
exports.update = async (req, res) => {
  if (!req.auth.userId) {
    return res.render("error")
  } else {
    try {
      const sid = req.params.sid

      if (sid) {
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
        const student = data.toJSON()

        return res.render("update", { heading: "Update Student", student })
      }
    } catch (err) {
      console.log({ message: err.message })
      return
    }
  }
}

//
//
// create page submit *
exports.createStudent = async (req, res) => {
  if (!req.auth.userId || !req.body) {
    return res.render("error")
  }
  try {
    const userId = req.auth.userId

    let imageURL = null

    const fname = req.body.firstname.trim()
    const lname = req.body.lastname.trim()
    const birthdate = req.body.birthdate
    const phone = req.body.contact
    const address = req.body.address.trim()

    if (req.file) {
      const file = req.file
      const name = file.originalname
      const inputBuffer = req.file.buffer

      if (inputBuffer.length > 300000) {
        return res
          .status(400)
          .json({ error: "File size must be less than 300KB" })
      }

      const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"]
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          error: "Invalid file type. Please upload a JPEG, JPG, or PNG file.",
        })
      }

      const options = { access: "public", addRandomSuffix: false }
      const blob = await put(fname, inputBuffer, options)
      console.log(blob)
      imageURL = blob.url

      const outBuffer = await sharp(inputBuffer).resize(50, 50).toBuffer()

      const tblob = await put("thumb" + fname, outBuffer, options)
      console.log(tblob)
      thumbnailURL = tblob.url
    }
    const newStudent = await Students.create({
      s_firstname: fname,
      s_lastname: lname,
      s_birthdate: birthdate,
      s_contactno: phone,
      s_address: address,
      s_image_url: imageURL,
      updatedAt: new Date(),
    })

    res.redirect("/dashboard")

    const studentId = newStudent.s_id
    await Crudlogs.create({
      user_id: userId,
      action_type: "CREATE",
      target_student_id: studentId,
    })
    return
  } catch (err) {
    console.error(err)

    if (err.message.includes("Invalid file format")) {
      return res.status(400).json({
        error: "Invalid file format. Please upload a JPEG, JPG, or PNG file.",
      })
    }

    return res.render("error")
  }
}

//
//
// delete data *
exports.delete = async (req, res) => {
  if (!req.auth.userId) {
    return res.render("error")
  } else {
    try {
      const userId = req.auth.userId

      const sid = req.params.sid
      await Students.update(
        { isRemoved: true, updatedAt: new Date() },
        { where: { s_id: sid } }
      )
      res.send(200)

      await Crudlogs.create({
        user_id: userId,
        action_type: "DELETE",
        target_student_id: sid,
      })
      return
    } catch (err) {
      return res.render("error")
    }
  }
}

//
//
// update student data
exports.updateStudent = async (req, res) => {
  const studentData = {}
  try {
    if (!req.auth.userId || !req.body) {
      return res.render("error")
    } else {
      const userId = req.auth.userId

      const sid = req.params.sid
      const fname = req.body.firstname
      const lname = req.body.lastname
      const birthdate = req.body.birthdate
      const phone = req.body.contact
      const address = req.body.address

      let imageURL = null
      if (req.file) {
        const file = req.file
        const name = file.originalname
        const inputBuffer = file.buffer

        if (inputBuffer.length > 300000) {
          return res
            .status(400)
            .json({ error: "File size must be less than 300KB" })
        }

        const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"]
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return res.status(400).json({
            error: "Invalid file type. Please upload a JPEG, JPG, or PNG file.",
          })
        }

        const options = { access: "public", addRandomSuffix: false }
        const blob = await put(fname, inputBuffer, options)
        console.log(blob)
        imageURL = blob.url

        const outBuffer = await sharp(inputBuffer).resize(50, 50).toBuffer()

        const tblob = await put("thumb" + fname, outBuffer, options)
        console.log(tblob)
        thumbnailURL = tblob.url
      }

      if (fname !== undefined && fname !== null && fname !== "") {
        studentData.s_firstname = fname
      }
      if (lname !== undefined && lname !== null && lname !== "") {
        studentData.s_lastname = lname
      }
      if (birthdate !== undefined && birthdate !== null && birthdate !== "") {
        studentData.s_birthdate = birthdate
      }
      if (phone !== undefined && phone !== null && phone !== "") {
        studentData.s_contactno = phone
      }
      if (address !== undefined && address !== null && address !== "") {
        studentData.s_address = address
      }
      if (imageURL !== undefined && imageURL !== null && imageURL !== "") {
        studentData.s_image_url = imageURL
      }
      studentData.updatedAt = new Date()
      await Students.update(studentData, { where: { s_id: sid } })

      res.redirect("/dashboard")
      await Crudlogs.create({
        user_id: userId,
        action_type: "UPDATE",
        target_student_id: sid,
      })
      return
    }
  } catch (err) {
    console.error(err)
    return res.render("error")
  }
}
