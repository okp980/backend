const path = require("path")
const ErrorResponse = require("./ErrorResponse")

exports.handleUploadImage = async (file, next) => {
  const uploadPath = path.join(__dirname, "public", "uploads")
  try {
    await file.mv(uploadPath)
  } catch (error) {
    next(new ErrorResponse("File Upload failed", 500))
  }
}
