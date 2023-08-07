const fs = require("fs").promises
const mongoose = require("mongoose")
const path = require("path")

const deleteFile = async (dir, file) => {
  await fs.unlink(path.join(__dirname, "..", "public", dir, file))
}

const runInTransaction = async (callback) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    await callback(session)
    await session.commitTransaction()
  } catch (error) {
    await session.abortTransaction()
    console.log("error in transaction", error)
    throw new Error("Server Error", 500)
  } finally {
    session.endSession()
  }
}

const getAdvancedResults = async (request, model, config) => {
  let query

  let queryStr = JSON.stringify(request.query)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  // parsed query

  queryStr = JSON.parse(queryStr)

  // fields to remove
  const removeFields = ["select", "sort", "page", "limit"]

  removeFields.forEach((item) => {
    if (queryStr[item]) {
      delete queryStr[item]
    }
  })

  //Add query from config
  if (config && config.hasOwnProperty("query")) {
    queryStr = { ...queryStr, ...config.query }
  }
  query = model.find(queryStr)

  // select field
  if (request.query.select) {
    const fields = request.query.select.split(",").join(" ")
    query.select(fields)
  }

  // sort by
  if (request.query.sort) {
    const sortBy = request.query.sort.split(",").join(" ")
    query.sort(sortBy)
  } else {
    query.sort("-createdAt")
  }

  // Pagination
  const page = parseInt(request.query.page, 10) || 1
  const limit = parseInt(request.query.limit, 10) || 5
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await model.countDocuments()

  query = query.skip(startIndex).limit(limit)

  const pagination = { current: page, limit, total }

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit,
    }
  }

  const result = config?.populate
    ? await query.populate([config.populate])
    : await query
  return {
    success: true,
    count: result.length,

    pagination: pagination,
    data: result,
  }
}

module.exports = { getAdvancedResults, runInTransaction, deleteFile }
