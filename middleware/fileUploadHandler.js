const { v4: uuidv4 } = require("uuid")
const path = require("path")
const ErrorResponse = require("../util/ErrorResponse")
const uploadToBucket = require("../util/s3")
const { deleteFile } = require("../util/helper")
const sharp = require("sharp")

const ImageUpload = function (req, res, next) {
  if (!req.files) {
    return next(new ErrorResponse("Please upload an image file", 400))
  }
  console.log("the incoming files", req.files)
  if (!req.files.image.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please upload an image file", 400))
  }

  //   Image
  const image = req.files.image

  console.log("image", image)

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
    // resize image
    const resizedImage = await sharp(image.data)
      .resize({ width: 100, height: 100 })
      .jpeg()
      .toFile(uploadPath)
    console.log("value of resize", resizedImage)
    // change to new image format
    const key = "photo_" + uuidv4() + "." + resizedImage.format
    const result = await uploadToBucket(uploadPath, key)
    console.log("result upload", result)
    await deleteFile("uploads", image.name)
    // Attach image to request and call next()
    req.image = result.Location
    next()
  })
}

module.exports = { ImageUpload }
