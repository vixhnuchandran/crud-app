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

// const sampleStudents = [
//   {
//     s_firstname: "Alan",
//     s_lastname: "Jose",
//     s_birthdate: "1999-12-25",
//     s_contactno: "9865679023",
//     s_address: "Address 1",
//   },
//   {
//     s_firstname: "Bob",
//     s_lastname: "Smith",
//     s_birthdate: "2000-02-10",
//     s_contactno: "9876543210",
//     s_address: "Address 2",
//   },
//   {
//     s_firstname: "Charlie",
//     s_lastname: "Brown",
//     s_birthdate: "1998-08-15",
//     s_contactno: "9654321098",
//     s_address: "Address 3",
//   },
//   {
//     s_firstname: "David",
//     s_lastname: "Miller",
//     s_birthdate: "2001-05-20",
//     s_contactno: "9765432109",
//     s_address: "Address 4",
//   },
//   {
//     s_firstname: "Emma",
//     s_lastname: "Johnson",
//     s_birthdate: "1997-09-30",
//     s_contactno: "9988776655",
//     s_address: "Address 5",
//   },
//   {
//     s_firstname: "Frank",
//     s_lastname: "Williams",
//     s_birthdate: "2002-11-05",
//     s_contactno: "9876543210",
//     s_address: "Address 6",
//   },
//   {
//     s_firstname: "Grace",
//     s_lastname: "Davis",
//     s_birthdate: "1996-04-12",
//     s_contactno: "9876543210",
//     s_address: "Address 7",
//   },
//   {
//     s_firstname: "Harry",
//     s_lastname: "Anderson",
//     s_birthdate: "2003-07-18",
//     s_contactno: "9876543210",
//     s_address: "Address 8",
//   },
//   {
//     s_firstname: "Ivy",
//     s_lastname: "Hernandez",
//     s_birthdate: "1995-01-22",
//     s_contactno: "9876543210",
//     s_address: "Address 9",
//   },
//   {
//     s_firstname: "Jack",
//     s_lastname: "Taylor",
//     s_birthdate: "2004-03-08",
//     s_contactno: "9876543210",
//     s_address: "Address 10",
//   },
//   {
//     s_firstname: "Kelly",
//     s_lastname: "Clark",
//     s_birthdate: "1994-06-28",
//     s_contactno: "9876543210",
//     s_address: "Address 11",
//   },
//   {
//     s_firstname: "Liam",
//     s_lastname: "Moore",
//     s_birthdate: "2005-09-14",
//     s_contactno: "9876543210",
//     s_address: "Address 12",
//   },
//   {
//     s_firstname: "Mia",
//     s_lastname: "Garcia",
//     s_birthdate: "1993-12-03",
//     s_contactno: "9876543210",
//     s_address: "Address 13",
//   },
//   {
//     s_firstname: "Noah",
//     s_lastname: "Thomas",
//     s_birthdate: "2006-02-19",
//     s_contactno: "9876543210",
//     s_address: "Address 14",
//   },
//   {
//     s_firstname: "Olivia",
//     s_lastname: "Lopez",
//     s_birthdate: "1992-05-07",
//     s_contactno: "9876543210",
//     s_address: "Address 15",
//   },
//   {
//     s_firstname: "Parker",
//     s_lastname: "Lee",
//     s_birthdate: "2007-08-23",
//     s_contactno: "9876543210",
//     s_address: "Address 16",
//   },
//   {
//     s_firstname: "Quinn",
//     s_lastname: "Martinez",
//     s_birthdate: "1991-10-31",
//     s_contactno: "9876543210",
//     s_address: "Address 17",
//   },
//   {
//     s_firstname: "Ryan",
//     s_lastname: "White",
//     s_birthdate: "2008-01-15",
//     s_contactno: "9876543210",
//     s_address: "Address 18",
//   },
//   {
//     s_firstname: "Sophia",
//     s_lastname: "Hall",
//     s_birthdate: "1990-03-27",
//     s_contactno: "9876543210",
//     s_address: "Address 19",
//   },
//   {
//     s_firstname: "Tyler",
//     s_lastname: "Young",
//     s_birthdate: "2009-06-10",
//     s_contactno: "9876543210",
//     s_address: "Address 20",
//   },
// ]
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
