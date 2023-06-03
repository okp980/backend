const { v4: uuidv4 } = require("uuid")
const path = require("path")
const ErrorResponse = require("../util/ErrorResponse")

const ImageUpload = function (req, res, next) {
  if (!req.files) {
    return next(new ErrorResponse("Please upload an image file", 400))
  }
  if (!req.files.image.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please upload an image file", 400))
  }

  //   Image
  const image = req.files.image

  // Image Name
  image.name =
    "photo_" + uuidv4().replace(/-/gi, "") + path.parse(image.name).ext

  // Upload Path
  const uploadPath = path.join(__dirname, "..", "public", "uploads", image.name)

  image.mv(uploadPath, async function (err) {
    if (err) {
      console.log(err)
      return next(new ErrorResponse("Image upload failed", 500))
    }
    // Attach image to request and call next()
    req.image = image
    next()
  })
}

module.exports = { ImageUpload }
