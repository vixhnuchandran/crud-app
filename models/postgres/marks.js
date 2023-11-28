const { sequelize } = require("../../config/postgres")
const { DataTypes } = require("sequelize")
const Students = require("../postgres/student")

const Marks = sequelize.define(
  "students_marks",
  {
    sl_no: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    s_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // foreignKey: true,
    },

    maths: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    physics: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    chemistry: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    biology: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    language: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true, timestamps: false }
)
Marks.belongsTo(Students, { foreignKey: "s_id" })
Students.hasOne(Marks, { foreignKey: "s_id" })

// Marks.sync({ force: true }).then(() => {
//   console.log(`Table created!`)
// })

module.exports = Marks
