const Students = require("../models/postgres/student")
const Marks = require("../models/postgres/marks")

// Function to create new student data
const createStudent = async newData => {
  try {
    const response = await Students.create(newData)
    return response
  } catch (error) {
    console.error(error.message)
    throw error
  }
}

// Function to find student data
const readStudent = {
  // All student data
  all: async () => {
    try {
      const response = (data = await Students.findAll({
        where: {
          isRemoved: false,
        },
        attributes: {
          exclude: ["isRemoved"],
        },
        order: [["s_id", "ASC"]],
      }))

      return response
    } catch (error) {
      console.error(error.message)
      throw error
    }
  },

  // One student's data
  one: async studentId => {
    try {
      const response = await Students.findOne({
        where: { isRemoved: false, s_id: studentId },
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
        attributes: {
          exclude: ["isRemoved"],
        },
      })
      return response
    } catch (error) {
      console.error(error.message)
      throw error
    }
  },
}

// Function to update a student data
const updateStudent = async (studentId, studentData) => {
  try {
    const response = await Students.update(studentData, {
      where: { isRemoved: false, s_id: studentId },
    })
    return response
  } catch (error) {
    console.error(error.message)
    throw error
  }
}

// Function to update(or soft delete) a student data
const deleteStudent = async studentId => {
  try {
    const response = await Students.update(
      { isRemoved: true },
      {
        where: { isRemoved: false, s_id: studentId },
      }
    )
    return response
  } catch (error) {
    console.error(error.message)
    throw error
  }
}
module.exports = { createStudent, readStudent, updateStudent, deleteStudent }

// await Students.findAll({
//   where: { isRemoved: false },
//   attributes: attributes || [
//     ["s_id", "studentId"],
//     ["s_firstname", "firstname"],
//     ["s_lastname", "lastname"],
//     ["s_birthdate", "birthdate"],
//     ["s_emailid", "email"],
//     ["s_class", "class"],
//     ["s_image_url", "imageurl"],
//   ],
// })

// const data = await StudentsM.findOne({
//   where: { isRemoved: false, s_id: sid },
//   include: [
//     {
//       model: Marks,
//       attributes: [
//         "maths",
//         "physics",
//         "chemistry",
//         "biology",
//         "language",
//       ],
//     },
//   ],
//   attributes: [
//     ["s_id", "studentId"],
//     ["s_firstname", "firstname"],
//     ["s_lastname", "lastname"],
//     ["s_image_url", "imageurl"],
//   ],
// })
