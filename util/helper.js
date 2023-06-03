const fs = require("fs").promises
const mongoose = require("mongoose")
const path = require("path")

exports.deleteFile = async (dir, file) => {
  await fs.unlink(path.join(__dirname, "..", "public", dir, file))
}

exports.runInTransaction = async (callback) => {
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
