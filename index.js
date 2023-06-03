const path = require("path")
const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const fileUpload = require("express-fileupload")
const cookieParser = require("cookie-parser")

// Routes
const productRouter = require("./routes/products")
const categoryRouter = require("./routes/category")
const subcategoryRouter = require("./routes/subcategory")
const AuthRouter = require("./routes/auth")
const UserRouter = require("./routes/users")
const couponRouter = require("./routes/coupon")
const cartRouter = require("./routes/cart")
const orderRouter = require("./routes/order")
const paymentRouter = require("./routes/payment")
const shipppingAddressRouter = require("./routes/shippingAddress")
const shipppingMethodRouter = require("./routes/shippingMethod")

// Db
const connectDB = require("./db")

const { default: mongoose } = require("mongoose")
const errorHandler = require("./middleware/errorHandler")
const ErrorResponse = require("./util/ErrorResponse")

// initialize
connectDB()
dotenv.config()

const app = express()
const port = process.env.PORT || 4000

// morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"))
}

// body parser
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.use(cookieParser())

app.use(fileUpload())

// handle routes
app.use("/api/v1/auth", AuthRouter)
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/orders", orderRouter)
// app.use("/api/v1/pay", paymentRouter)
app.use("/api/v1/users", UserRouter)
app.use("/api/v1/coupons", couponRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/categories", categoryRouter)
app.use("/api/v1/subcategories", subcategoryRouter)
app.use("/api/v1/shipping-address", shipppingAddressRouter)
app.use("/api/v1/shipping-methods", shipppingMethodRouter)

// 404 error
app.use((req, res, next) => {
  next(new ErrorResponse("Page Not Found", 404))
})

// Error middleware
app.use(errorHandler)

mongoose.connection.once("open", () => {
  app.listen(port, () => {
    console.log(`server is running on port ${port}`)
  })
})

// handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`)

  // Close server and exit
  server.close(() => process.exit(1))
})
