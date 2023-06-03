const mongoose = require("mongoose")

const uri =
  "mongodb+srv://okpunorrex:5wvlarid4UG9axGo@cluster0.lrtp6ab.mongodb.net/?retryWrites=true&w=majority"
const connect = async () => {
  const conn = await mongoose.connect(uri)
  console.log("DB is connected : " + conn.connection.host)
}

module.exports = connect
