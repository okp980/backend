const fs = require("fs")
const S3 = require("aws-sdk/clients/s3")
require("dotenv").config()

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_BUCKET_REGION,
})

const uploadToBucket = async (file, key) => {
  // const fileStream = fs.createReadStream(file)
  // fileStream.on("error", (error) => {
  //   console.log("error to s3 upload")
  //   console.log(error)
  //   throw error
  // })

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: file.buffer,
    Key: key,
  }

  return s3.upload(params).promise()
}

module.exports = uploadToBucket
