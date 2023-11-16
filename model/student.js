const { sequelize } = require("../config/database")
const { DataTypes } = require("sequelize")

const Students = sequelize.define(
  "students_info",
  {
    s_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    s_firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    s_lastname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    s_birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    s_contactno: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    s_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    s_image_url: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    isRemoved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { freezeTableName: true }
)

// Students.sync({ force: true }).then(() => {
//   console.log(`Table created!`)
// })

// async function updateIsRemovedColumn() {
//   try {
//     await Students.update({ isRemoved: false }, { where: {} })
//     console.log("Update successful!")
//   } catch (error) {
//     console.error("Error updating records:", error)
//   } finally {
//     await sequelize.close()
//   }
// }
// updateIsRemovedColumn()
module.exports = Students
