const mongoose = require("mongoose")
const Schema = mongoose.Schema
const connectDB = require("../../config/mongo")

connectDB()

// defines audit logs schema
const crudlogs = new Schema({
  s_id: {
    type: Number,
    unique: true,
  },

  user_id: {
    type: String,
    required: true,
  },
  action_type: {
    type: String,
    required: true,
  },
  target_id: {
    type: Number,
    required: true,
  },
})

// creating new model using the students schema
const Crudlogs = mongoose.model("crud_logs", crudlogs, "crud_logs")
// const students = []
// Students.insertMany(students)
//   .then(data => {
//     console.log("Student saved: ", data)
//   })
//   .catch(error => {
//     console.log("Error saving student: ", error)
//   })

module.exports = Crudlogs
