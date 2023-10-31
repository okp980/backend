const path = require("path")
const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const fileUpload = require("express-fileupload")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const passport = require("passport")
const { Strategy } = require("passport-google-oauth20")
const JwtStrategy = require("passport-jwt").Strategy
const LocalStrategy = require("passport-local")
const ExtractJwt = require("passport-jwt").ExtractJwt
const bcrypt = require("bcrypt")

// Routes
const productRouter = require("./routes/products")
const categoryRouter = require("./routes/category")
const subcategoryRouter = require("./routes/subcategory")
const AuthRouter = require("./routes/auth")
const UserRouter = require("./routes/users")
const couponRouter = require("./routes/coupon")
const cartRouter = require("./routes/cart")
const orderRouter = require("./routes/order")
const paymentMethodRouter = require("./routes/paymentMethod")
const shipppingAddressRouter = require("./routes/shippingAddress")
const shipppingMethodRouter = require("./routes/shippingMethod")
const analyticsRouter = require("./routes/analytics")
const attributeRouter = require("./routes/attributes")
const attributeValueRouter = require("./routes/attributeValues")
const tagRouter = require("./routes/tags")
const exchangeRateRouter = require("./routes/exchangeRate")
const summaryRouter = require("./routes/summary")
const reviewRouter = require("./routes/review")

// Db
const connectDB = require("./db")

const mongoose = require("mongoose")
const errorHandler = require("./middleware/errorHandler")
const ErrorResponse = require("./util/ErrorResponse")
const User = require("./models/User")

// initialize
connectDB()
dotenv.config()

// Google strategy
passport.use(
  new Strategy(
    {
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const user = await User.findOne({
          email: profile.emails[0].value,
        })
        if (!user) {
          const user = await User.create({
            source: "google",
            email: profile.emails[0].value,
          })
          return cb(null, user?.id)
        }
        return cb(null, user?.id)
      } catch (error) {
        return cb(error)
      }
    }
  )
)

// Local strategy
passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    try {
      const user = await User.findOne({ email: username }).select("+password")
      if (!user)
        return cb(null, false, { message: "Incorrect username or password." })
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch)
        return cb(null, false, {
          message: "Incorrect username or password.",
        })
      return cb(null, user?.id)
    } catch (error) {
      return cb(error)
    }
  })
)

// jwt strategy
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.SECRET_JWT
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log("jwt_payload", jwt_payload)
    try {
      const user = await User.findOne({ id: jwt_payload.sub })
      if (!user)
        return done(null, false, { message: "Incorrect username or password." })
      return done(null, user)
    } catch (error) {
      done(err, false)
    }
  })
)

const app = express()
const port = process.env.PORT || 4000

// CORS
// var whitelist = ["https://zuraaya-admin.vercel.app", "http://localhost:4000"]
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error("Not allowed by CORS"))
//     }
//   },
// }
// app.use(cors())
app.use(cors())

// morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"))
}

// body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(cookieParser())

// app.use(fileUpload())

// passport
app.use(passport.initialize())

// handle routes
app.use("/api/v1/auth", AuthRouter)
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/orders", orderRouter)
app.use("/api/v1/analytics", analyticsRouter)
// app.use("/api/v1/pay", paymentRouter)
app.use("/api/v1/users", UserRouter)
app.use("/api/v1/coupons", couponRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/categories", categoryRouter)
app.use("/api/v1/subcategories", subcategoryRouter)
app.use("/api/v1/payment-methods", paymentMethodRouter)
app.use("/api/v1/shipping-address", shipppingAddressRouter)
app.use("/api/v1/shipping-methods", shipppingMethodRouter)
app.use("/api/v1/attributes", attributeRouter)
app.use("/api/v1/attribute-values", attributeValueRouter)
app.use("/api/v1/tags", tagRouter)
app.use("/api/v1/exchange-rates", exchangeRateRouter)
app.use("/api/v1/summary", summaryRouter)
app.use("/api/v1/reviews", reviewRouter)

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
