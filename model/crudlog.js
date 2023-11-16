const { sequelize } = require("../config/database")
const { DataTypes } = require("sequelize")

const Crudlogs = sequelize.define(
  "crudlogs",
  {
    sl_no: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    action_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    target_student_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  { freezeTableName: true, timestamps: false }
)

// Crudlogs.sync({ force: true }).then(() => {
//   console.log(`Table created!`)
// })

module.exports = Crudlogs
