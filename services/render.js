const { put, del } = require("@vercel/blob")
const Crudlogs = require("../models/postgres/crudlog")

const { Students } = require("../models/mongo/students")

const { createData, readData, updateData } = require("../utils/mongooseUtils")
const { calculateGradeAndGPA, calculateAge } = require("../utils/utils")

const sharp = require("sharp")
const { clerkClient } = require("@clerk/clerk-sdk-node")
require("dotenv").config()

//
//
// dashboard (mongo)
exports.dashboard = async (req, res) => {
  if (!req.auth.userId) {
    return res.render("dashboardError", { message: "Access to Dashboard" })
  } else {
    try {
      const resultsPerPage = 7
      const count = await Students.countDocuments({ isRemoved: false })
      const numOfData = count
      const numOfPages = Math.ceil(numOfData / resultsPerPage)
      let page = req.query.page ? Number(req.query.page) : 1
      const startingLimit = (page - 1) * resultsPerPage

      if (page > numOfPages) {
        res.redirect("/dashboard?page=" + encodeURIComponent(numOfPages))
      } else if (page < 1) {
        res.redirect("/dashboard?page=" + encodeURIComponent("1"))
      }
      let sortby, tSortBy, orderType, attributes, columns, colValues
      sortby =
        req.query.sortby === "id" || "firstname" || "lastname" || "email"
          ? req.query.sortby
          : "id"

      orderType = req.query.order === "1" ? "-1" : "1"

      if (req.query.columns) {
        colValues = req.query.columns
        columns = req.query.columns.split(",")

        attributes = columns.map(column => {
          if (column === "id") {
            return ["s_id", "studentId"]
          } else if (column === "firstname") {
            return ["s_firstname", "firstname"]
          } else if (column === "lastname") {
            return ["s_lastname", "lastname"]
          } else if (column === "birthdate") {
            return ["s_birthdate", "birthdate"]
          } else if (column === "email") {
            return ["s_emailid", "email"]
          } else if (column === "class") {
            return ["s_class", "class"]
          } else if (column === "image") {
            return ["s_image_url", "imageurl"]
          }
          return null
        })
        attributes = attributes.filter(attribute => attribute !== null)
      }

      if (sortby === "firstname") {
        tSortBy = "s_firstname"
      } else if (sortby === "lastname") {
        tSortBy = "s_lastname"
      } else if (sortby === "email") {
        tSortBy = "s_emailid"
      } else {
        tSortBy = "s_id"
      }

      let proj = {}

      if (attributes) {
        attributes.forEach(([key, value]) => {
          proj[value] = `$${key}`
        })
      }
      console.log(orderType)
      const filter = {
        isRemoved: false,
      }

      console.log(proj)
      const defaultProjection = {
        studentId: "$s_id",
        firstname: "$s_firstname",
        lastname: "$s_lastname",
        birthdate: "$s_birthdate",
        email: "$s_emailid",
        class: "$s_class",
        imageurl: "$s_image_url",
      }

      const projection =
        proj && Object.keys(proj).length > 0 ? proj : defaultProjection

      const order = [[tSortBy, parseInt(orderType)]]
      console.log(order)
      const limit = resultsPerPage
      const offset = startingLimit

      let data = await readData.all(
        Students,
        filter,
        projection,
        order,
        offset,
        limit
      )

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
        orderType,
        colValues,
        sortby,
        students,
        page,
        iterator,
        endingLink,
        numOfPages,
      })
    } catch (error) {
      console.log(error)
      return res.render("error")
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
        students_mark: "$s_marks",
      })

      const studentData = data.toJSON()
      console.log()
      if (studentData.students_mark[0] === undefined) {
        return res.status(404).render("createMarksheet", { studentData })
      }

      const mathsResult = calculateGradeAndGPA(
        studentData.students_mark[0].maths
      )
      const physicsResult = calculateGradeAndGPA(
        studentData.students_mark[0].physics
      )
      const chemistryResult = calculateGradeAndGPA(
        studentData.students_mark[0].chemistry
      )
      const biologyResult = calculateGradeAndGPA(
        studentData.students_mark[0].biology
      )
      const languageResult = calculateGradeAndGPA(
        studentData.students_mark[0].language
      )

      const maths = { grade: mathsResult.grade, gpa: mathsResult.gpa }
      const physics = { grade: physicsResult.grade, gpa: physicsResult.gpa }
      const chemistry = {
        grade: chemistryResult.grade,
        gpa: chemistryResult.gpa,
      }
      const biology = { grade: biologyResult.grade, gpa: biologyResult.gpa }
      const language = {
        grade: languageResult.grade,
        gpa: languageResult.gpa,
      }
      return res.status(200).render("marksheet", {
        studentData,
        maths,
        physics,
        chemistry,
        biology,
        language,
      })
    } catch (error) {
      console.log(error.message)
      return res.status(500).render("error")
    }
  }
}

//
//
// contact info page
exports.contactInfo = async (req, res) => {
  if (!req.auth.userId) {
    return res.render("dashboardError", { message: "Access to View" })
  } else {
    try {
      const sid = req.params.sid

      const filter = {
        isRemoved: false,
        s_id: sid,
      }

      const projection = {
        studentId: "$s_id",
        firstname: "$s_firstname",
        lastname: "$s_lastname",
        email: "$s_emailid",
        contact: "$s_contactno",
        address: "$s_address",
      }

      let studentData = await readData.one(Students, filter, projection)

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
//
// student info page
exports.studentInfo = async (req, res) => {
  if (!req.auth.userId) {
    return res.render("dashboardError", { message: "Access to View" })
  } else {
    try {
      const sid = req.params.sid

      const filter = {
        isRemoved: false,
        s_id: sid,
      }

      const projection = {
        studentId: "$s_id",
        firstname: "$s_firstname",
        lastname: "$s_lastname",
        class: "$s_class",
        imageurl: "$s_image_url",
      }

      let studentData = await readData.one(Students, filter, projection)
      studentData = studentData.toJSON()
      return res.status(200).render("student", {
        studentData,
      })
    } catch (error) {
      console.log(error)
      return res.status(200).render("error")
    }
  }
}

//
//
// view + personal info
exports.view = async (req, res) => {
  if (!req.auth.userId) {
    return res.render("dashboardError", { message: "Access to View" })
  } else {
    try {
      const sid = req.params.sid

      const filter = {
        isRemoved: false,
        s_id: sid,
      }

      const projection = {
        studentId: "$s_id",
        firstname: "$s_firstname",
        lastname: "$s_lastname",
        birthdate: "$s_birthdate",
        gender: "$s_gender",
        nationality: "$s_nationality",
        imageurl: "$s_image_url",
      }

      let studentData = await readData.one(Students, filter, projection)

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

//
//
// update form page
exports.update = async (req, res) => {
  if (!req.auth.userId) {
    return res.render("error")
  } else {
    try {
      const sid = req.params.sid
      const projection = {
        studentId: "$s_id",
        firstname: "$s_firstname",
        lastname: "$s_lastname",
        birthdate: "$s_birthdate",
        gender: "$s_gender",
        nationality: "$s_nationality",
        contact: "$s_contactno",
        email: "$s_emailid",
        address: "$s_address",
        class: "$s_class",
        // imageurl: "$s_image_url",
      }
      if (sid) {
        const data = await readData.one(
          Students,
          { s_id: sid, isRemoved: false },
          projection
        )

        const student = data.toJSON()
        console.log(student)
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
      const filter = { s_id: sid }
      const update = {
        s_marks: [
          {
            maths: req.body.maths,
            physics: req.body.physics,
            chemistry: req.body.chemistry,
            biology: req.body.biology,
            language: req.body.language,
          },
        ],
      }
      const response = await updateData(Students, filter, update)

      console.log(response)
      return res.status(200).redirect(`/dashboard/marksheet/${sid}`)
    } catch (error) {}
  }
}

//
//
// create page submit * (mongo)
exports.createStudent = async (req, res) => {
  if (!req.auth.userId || !req.body) {
    return res.render("error")
  } else {
    try {
      const user = await clerkClient.users.getUser(req.auth.userId)

      let imageURL = null

      // const fname = req.body.firstname.trim()
      // const lname = req.body.lastname.trim()

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

        //   imageURL = await toVercelBlob(fname + lastname, inputBuffer)
        //   const outBuffer = await sharp(inputBuffer).resize(50, 50).toBuffer()
        //   await toVercelBlob(fname + lname + "thumb", outBuffer)
      }

      const studentData = {
        s_id: req.body.id,
        s_firstname: req.body.firstname
          .trim()
          .replace(/\b\w/g, char => char.toUpperCase()),
        s_lastname: req.body.lastname
          .trim()
          .replace(/\b\w/g, char => char.toUpperCase()),
        s_birthdate: req.body.birthdate,
        s_contactno: req.body.contact,
        s_emailid: req.body.email.trim(),
        s_gender: req.body.gender,
        s_class: req.body.class.trim(),
        s_nationality: req.body.nationality,
        s_address: req.body.address.trim(),
        s_image_url: imageURL,
      }

      const newStudent = await createData(Students, studentData)

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
}

//
//
// update student data (mongo)
exports.updateStudent = async (req, res) => {
  const studentData = {}
  try {
    if (!req.auth.userId || !req.body) {
      return res.render("error")
    } else {
      const user = await clerkClient.users.getUser(req.auth.userId)

      const sid = req.params.sid
      const fname = req.body.firstname
        .trim()
        .replace(/\b\w/g, char => char.toUpperCase())
      const lname = req.body.lastname
        .trim()
        .replace(/\b\w/g, char => char.toUpperCase())
      const birthdate = req.body.birthdate
      const phone = req.body.contact
      const address = req.body.address.trim()
      const gender = req.body.gender
      const classname = req.body.class
      const nationality = req.body.nationality
      const email = req.body.email.trim()
      // const imageurl = req.body.imageurl

      let imageURL = null
      // let thumbnailURL = imageurl.replace(
      //   fname + lname,
      //   fname + lname + "thumb"
      // )
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
        // await del(imageurl).then(async () => {
        //   await del(thumbnailURL).then(async () => {
        //     imageURL = await toVercelBlob(fname + lname, inputBuffer)
        //     const outBuffer = await sharp(inputBuffer).resize(50, 50).toBuffer()
        //     thumbnailURL = await toVercelBlob(
        //       fname + lname + "thumb",
        //       outBuffer
        //     )
        //   })
        // })
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

      await updateData(Students, { s_id: sid, isRemoved: false }, studentData)

      res.redirect("/dashboard")
      await Crudlogs.create({
        user_id: user.username,
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

//
//
// delete data * (mongo)
exports.delete = async (req, res) => {
  if (!req.auth.userId) {
    return res.render("error")
  } else {
    try {
      const user = await clerkClient.users.getUser(req.auth.userId)

      const sid = req.params.sid

      await updateData(Students, { s_id: sid }, { isRemoved: true })

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
