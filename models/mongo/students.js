const mongoose = require("mongoose")
const Schema = mongoose.Schema

const studentMarks = new Schema(
  {
    s_id: {
      type: Number,
      unique: true,
    },

    maths: {
      type: Number,
      required: true,
    },
    physics: {
      type: Number,
      required: false,
    },
    chemistry: {
      type: Number,
      required: true,
    },
    biology: {
      type: Number,
      required: true,
    },
    language: {
      type: Number,
      required: true,
    },
  },
  { timestamps: false }
)
const Marks = mongoose.model("students_marks", studentMarks, "students_marks")

const studentsInfo = new Schema(
  {
    s_id: {
      type: Number,
      unique: true,
    },
    s_class: {
      type: String,
      default: "X",
    },

    s_firstname: {
      type: String,
      required: true,
    },
    s_lastname: {
      type: String,
      required: false,
    },
    s_birthdate: {
      type: Date,
      required: true,
    },
    s_gender: {
      type: String,
      required: true,
    },
    s_emailid: {
      type: String,
      required: true,
    },
    s_contactno: {
      type: String,
      required: true,
    },

    s_address: {
      type: String,
      required: true,
    },
    s_nationality: {
      type: String,
      default: "Indian",
    },
    s_image_url: {
      type: String,
      default: null,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
    marks: { type: mongoose.ObjectId, ref: "Marks" },
  },
  { timestamps: false }
)

const Students = mongoose.model("students_info", studentsInfo, "students_info")

// Students.findOne({ s_id: 4 })
//   .populate({ path: "marks" })
//   .then(data => {
//     console.log(data.toJSON())
//   })
//   .catch(error => {
//     console.error(error)
//   })

module.exports = { Students, Marks }
