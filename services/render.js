const { put, del } = require("@vercel/blob")
const Students = require("../model/student")
const Crudlogs = require("../model/crudlog")
const Marks = require("../model/marks")
const { calculateGradeAndGPA, calculateAge } = require("../utils/utils")

const sharp = require("sharp")
const { Clerk, clerkClient } = require("@clerk/clerk-sdk-node")
require("dotenv").config()

const URL = process.env.BASE_URL
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY })

//
// contact info page
exports.contactInfo = async (req, res) => {
  if (!req.auth.userId) {
    return res.render("dashboardError", { message: "Access to View" })
  } else {
    try {
      const sid = req.params.sid
      let studentData = await Students.findByPk(sid, {
        attributes: [
          ["s_id", "studentId"],
          ["s_firstname", "firstname"],
          ["s_lastname", "lastname"],
          ["s_emailid", "email"],
          ["s_contactno", "contact"],
          ["s_address", "address"],
          ["s_image_url", "imageurl"],
        ],
      })
      studentData = studentData.toJSON()

      return res.status(200).render("contact", {
        studentData,
      })
    } catch (error) {
      return res.status(200).render("error")
    }
  }
}

//
// student info page
exports.studentInfo = async (req, res) => {
  if (!req.auth.userId) {
    return res.render("dashboardError", { message: "Access to View" })
  } else {
    try {
      const sid = req.params.sid
      let studentData = await Students.findByPk(sid, {
        attributes: [
          ["s_id", "studentId"],
          ["s_firstname", "firstname"],
          ["s_lastname", "lastname"],
          ["s_class", "class"],
          ["s_image_url", "imageurl"],
        ],
      })
      studentData = studentData.toJSON()

      return res.status(200).render("student", {
        studentData,
      })
    } catch (error) {
      return res.status(200).render("error")
    }
  }
}

// view + personal info
exports.view = async (req, res) => {
  if (!req.auth.userId) {
    return res.render("dashboardError", { message: "Access to View" })
  } else {
    try {
      const sid = req.params.sid
      let studentData = await Students.findByPk(sid, {
        attributes: [
          ["s_id", "studentId"],
          ["s_firstname", "firstname"],
          ["s_lastname", "lastname"],
          ["s_birthdate", "birthdate"],
          ["s_gender", "gender"],
          ["s_nationality", "nationality"],
          ["s_image_url", "imageurl"],
        ],
      })
      studentData = studentData.toJSON()

      const age = calculateAge(studentData.birthdate)

      return res.status(200).render("view", {
        studentData,
        age,
      })
    } catch (error) {
      return res.status(200).render("error")
    }
  }
}

// dashboard
exports.dashboard = async (req, res) => {
  if (!req.auth.userId) {
    return res.render("dashboardError", { message: "Access to Dashboard" })
  } else {
    try {
      const resultsPerPage = 7
      const allData = await Students.findAll({
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
        order: [["s_id", "ASC"]],
      })

      const numOfData = allData.length
      const numOfPages = Math.ceil(numOfData / resultsPerPage)
      let page = req.query.page ? Number(req.query.page) : 1
      const startingLimit = (page - 1) * resultsPerPage

      if (page > numOfPages) {
        res.redirect("/dashboard?page=" + encodeURIComponent(numOfPages))
      } else if (page < 1) {
        res.redirect("/dashboard?page=" + encodeURIComponent("1"))
      }
      let sortby, tSortBy
      sortby = req.query.sortby || "id"
      if (sortby === "firstname") {
        tSortBy = "s_firstname"
      } else if (sortby === "lastname") {
        tSortBy = "s_lastname"
      } else if (sortby === "email") {
        tSortBy = "s_emailid"
      } else if (sortby === "id") {
        tSortBy = "s_id"
      } else {
        tSortBy = "s_id"
      }

      const data = await Students.findAll({
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
        order: [[tSortBy, "ASC"]],
        limit: resultsPerPage,
        offset: startingLimit,
      })
      let iterator, endingLink

      if (page === 1) {
        iterator = page
        endingLink = Math.min(numOfPages, iterator + 2)
      } else {
        iterator = Math.max(1, page - 2)
        endingLink = Math.min(numOfPages, iterator + 4)
      }

      const students = data.map(student => student.toJSON())
      return res.render("dashboard", {
        sortby,
        students,
        page,
        iterator,
        endingLink,
        numOfPages,
      })
    } catch (error) {
      // res.render("error")
      res.json(error.message)
      return
    }
  }
}

//
//
// marksheet
exports.marksheet = async (req, res) => {
  if (!req.auth.userId) {
    return res.render("dashboardError", { message: "Access to Marsheet" })
  } else {
    try {
      const sid = req.params.sid
      const data = await Students.findByPk(sid, {
        include: [
          {
            model: Marks,
            attributes: [
              "maths",
              "physics",
              "chemistry",
              "biology",
              "language",
            ],
          },
        ],
        attributes: [
          ["s_id", "studentId"],
          ["s_firstname", "firstname"],
          ["s_lastname", "lastname"],
          ["s_image_url", "imageurl"],
        ],
      })
      const studentData = data.toJSON()
      if (!studentData.students_mark) {
        return res.status(404).render("createMarksheet", { studentData })
      }

      const mathsResult = calculateGradeAndGPA(studentData.students_mark.maths)
      const physicsResult = calculateGradeAndGPA(
        studentData.students_mark.physics
      )
      const chemistryResult = calculateGradeAndGPA(
        studentData.students_mark.chemistry
      )
      const biologyResult = calculateGradeAndGPA(
        studentData.students_mark.biology
      )
      const languageResult = calculateGradeAndGPA(
        studentData.students_mark.language
      )

      const maths = { grade: mathsResult.grade, gpa: mathsResult.gpa }
      const physics = { grade: physicsResult.grade, gpa: physicsResult.gpa }
      const chemistry = {
        grade: chemistryResult.grade,
        gpa: chemistryResult.gpa,
      }
      const biology = { grade: biologyResult.grade, gpa: biologyResult.gpa }
      const language = { grade: languageResult.grade, gpa: languageResult.gpa }

      return res.status(200).render("marksheet", {
        studentData,
        maths,
        physics,
        chemistry,
        biology,
        language,
      })
    } catch (error) {
      // console.log(error.message)
      return res.status(500).render("error")
      return
    }
  }
}

//logs
exports.logs = async (req, res) => {
  if (!req.auth.userId) {
    return res.render("dashboardError", { message: "Access to Logs" })
  } else {
    try {
      const data = await Crudlogs.findAll({
        attributes: [
          ["sl_no", "slno"],
          ["user_id", "userid"],
          ["action_type", "action"],
          ["target_student_id", "targetid"],
          ["timestamp", "timestamp"],
        ],
        order: [["sl_no", "DESC"]],
      })

      const logs = data.map(log => log.toJSON())

      return res.render("logs", { logs })
    } catch (error) {
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
//about page
exports.createMarksheet = (req, res) => {
  return res.render("marksheetForm")
}

// update marksheet form page
// exports.upadteMarksheet = async (req, res) => {
//   if (!req.auth.userId) {
//     return res.render("error")
//   } else {
//   }
// }

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
            ["s_class", "class"],
            ["s_firstname", "firstname"],
            ["s_lastname", "lastname"],
            ["s_birthdate", "birthdate"],
            ["s_gender", "gender"],
            ["s_emailid", "email"],
            ["s_contactno", "contact"],
            ["s_nationality", "nationality"],
            ["s_address", "address"],
            ["s_image_url", "imageurl"],
          ],
        })
        const student = data.toJSON()

        return res.render("update", { heading: "Update Student", student })
      }
    } catch (err) {
      return
    }
  }
}

async function toVercelBlob(name, buffer) {
  const options = { access: "public", addRandomSuffix: false }
  const blob = await put(name, buffer, options)
  return blob.url
}

//
//
// create new marksheet
exports.createNewMarksheet = async (req, res) => {
  if (!req.auth.userId || !req.body) {
    return res.render("error")
  } else {
    const sid = req.params.sid
    try {
      const newStudentMarks = await Marks.create({
        s_id: sid,
        maths: req.body.maths,
        physics: req.body.physics,
        chemistry: req.body.chemistry,
        biology: req.body.biology,
        language: req.body.language,
      })

      return res.status(200).redirect(`/dashboard/marksheet/${sid}`)
    } catch (error) {}
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
    const user = await clerkClient.users.getUser(req.auth.userId)

    let imageURL = null

    const fname = req.body.firstname.trim()

    if (req.file) {
      const file = req.file
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

      imageURL = await toVercelBlob(fname, inputBuffer)
      const outBuffer = await sharp(inputBuffer).resize(50, 50).toBuffer()
      const thumbnailURL = await toVercelBlob("thumb" + fname, outBuffer)
    }
    const newStudent = await Students.create({
      s_firstname: req.body.firstname.trim(),
      s_lastname: req.body.lastname.trim(),
      s_birthdate: req.body.birthdate,
      s_contactno: req.body.contact,
      s_emailid: req.body.email,
      s_gender: req.body.gender,
      s_class: req.body.class,
      s_nationality: req.body.nationality,
      s_address: req.body.address.trim(),
      s_image_url: imageURL,
    })

    res.redirect("/dashboard")

    const studentId = newStudent.s_id
    await Crudlogs.create({
      user_id: user.username,
      action_type: "CREATE",
      target_student_id: studentId,
    })
    return
  } catch (err) {
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
// update student data
exports.updateStudent = async (req, res) => {
  const studentData = {}
  try {
    if (!req.auth.userId || !req.body) {
      return res.render("error")
    } else {
      const user = await clerkClient.users.getUser(req.auth.userId)

      const sid = req.params.sid
      const fname = req.body.firstname.trim()
      const lname = req.body.lastname.trim()
      const birthdate = req.body.birthdate
      const phone = req.body.contact
      const address = req.body.address.trim()
      const gender = req.body.gender
      const classname = req.body.class
      const nationality = req.body.nationality
      const email = req.body.email
      const imageurl = req.body.imageurl

      let imageURL = null
      let thumbnailURL = imageurl.replace(
        fname + lname,
        fname + lname + "thumb"
      )
      if (req.file) {
        const file = req.file
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

        // console.log(imageurl, thumbnailURL)
        await del(imageurl).then(async () => {
          await del(thumbnailURL).then(async () => {
            imageURL = await toVercelBlob(fname + lname, inputBuffer)
            const outBuffer = await sharp(inputBuffer).resize(50, 50).toBuffer()
            thumbnailURL = await toVercelBlob(
              fname + lname + "thumb",
              outBuffer
            )
          })
        })
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
      if (gender !== undefined && gender !== null && gender !== "") {
        studentData.s_gender = gender
      }
      if (classname !== undefined && classname !== null && classname !== "") {
        studentData.s_class = classname
      }
      if (
        nationality !== undefined &&
        nationality !== null &&
        nationality !== ""
      ) {
        studentData.s_nationality = nationality
      }
      if (email !== undefined && email !== null && email !== "") {
        studentData.s_emailid = email
      }
      if (imageURL !== undefined && imageURL !== null && imageURL !== "") {
        studentData.s_image_url = imageURL
      }

      studentData.updatedAt = new Date()
      await Students.update(studentData, { where: { s_id: sid } })

      res.redirect("/dashboard")
      await Crudlogs.create({
        user_id: user.username,
        action_type: "UPDATE",
        target_student_id: sid,
      })
      return
    }
  } catch (err) {
    // console.error(err)
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
      const user = await clerkClient.users.getUser(req.auth.userId)

      const sid = req.params.sid
      await Students.update(
        { isRemoved: true, updatedAt: new Date() },
        { where: { s_id: sid } }
      )
      res.send(200)

      await Crudlogs.create({
        user_id: user.username,
        action_type: "DELETE",
        target_student_id: sid,
      })
      return
    } catch (err) {
      return res.render("error")
    }
  }
}
