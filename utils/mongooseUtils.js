/**
 * Create a new document in the specified model with the provided data.
 * @param {Model} model - Mongoose model.
 * @param {Object} data - Data to be inserted.
 * @returns {Promise<Document>} - Created document.
 */
const createData = async (model, data) => {
  try {
    const response = await model.create(data)
    return response
  } catch (error) {
    console.error(error.message)
    throw error
  }
}

// Retrieve data from a specified model with filter
const readData = {
  // All documents
  all: async (model, filter, projection, sort, skip, limit) => {
    try {
      const response = await model
        .find(filter)
        .select(projection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
      return response
    } catch (error) {
      console.error(error.message)
      throw error
    }
  },

  // One document
  one: async (model, filter, projection) => {
    try {
      const response = await model.findOne(filter, projection)
      return response
    } catch (error) {
      console.error(error.message)
      throw error
    }
  },
}

// Update (or soft delete) a document in specified model with filter and update details)
const updateData = async (model, filter, update) => {
  try {
    const response = await model.findOneAndUpdate(
      filter,
      {
        $set: update,
      },
      { new: true }
    )
    return response
  } catch (error) {
    console.error(error.message)
    throw error
  }
}

module.exports = { readData, createData, updateData }
