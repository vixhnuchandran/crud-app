const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { connectDBM } = require("../../config/mongo")

connectDBM()

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
    s_marks: {
      type: [
        {
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
      ],
      required: false,
    },

    isRemoved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: false }
)

const Students = mongoose.model("students_info", studentsInfo, "students_info")

module.exports = { Students }
