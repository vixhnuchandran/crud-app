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
      type: DataTypes.STRING,
    },
    action_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    target_student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { freezeTableName: true, timestamps: false }
)

// Crudlogs.sync({ force: true }).then(() => {
//   console.log(`Table created!`)
// })

module.exports = Crudlogs
