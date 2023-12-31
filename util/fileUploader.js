const multer = require("multer")
const path = require("path")

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "..", "public", "uploads"))
//   },
//   filename: function (req, file, cb) {
//     // generate the public name, removing problematic characters
//     const originalName = encodeURIComponent(
//       path.parse(file.originalname).name
//     ).replace(/[^a-zA-Z0-9]/g, "")
//     const timestamp = Date.now()
//     const extension = path.extname(file.originalname).toLowerCase()
//     cb(null, originalName + "_" + timestamp + extension)
//   },
// })

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mb
//   fileFilter: (req, file, callback) => {
//     const acceptableExtensions = ["png", "jpg", "jpeg", "jpg"]
//     if (
//       !acceptableExtensions.some(
//         (extension) =>
//           path.extname(file.originalname).toLowerCase() === `.${extension}`
//       )
//     ) {
//       return callback(
//         new Error(
//           `Extension not allowed, accepted extensions are ${acceptableExtensions.join(
//             ","
//           )}`
//         )
//       )
//     }
//     callback(null, true)
//   },
// })

const storage = multer.memoryStorage()
const upload = multer({ storage })

module.exports = upload
