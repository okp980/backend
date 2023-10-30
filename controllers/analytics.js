const Order = require("../models/Order")
const {
  subDays,
  startOfToday,
  startOfDay,
  endOfDay,
  format,
  startOfYear,
  endOfYear,
} = require("date-fns")
const Payment = require("../models/Payment")

const getAnalytics = async (req, res, next) => {
  try {
    const yearStart = startOfYear(new Date())
    const yearEnd = endOfYear(new Date())
    const thirtyDaysAgo = subDays(startOfToday(), 30)
    const todayStart = startOfDay(new Date())
    const todayEnd = endOfDay(new Date())

    const totalOrders = await Order.count({
      createdAt: { $gte: thirtyDaysAgo },
    })
    const totalRevenue = await Payment.count({
      createdAt: { $gte: thirtyDaysAgo },
      status: "success",
    })

    const todaysOrders = await Order.count({
      createdAt: { $gte: todayStart, $lt: todayEnd },
    })
    const todaysRevenue = await Payment.count({
      createdAt: { $gte: todayStart, $lt: todayEnd },
      status: "success",
    })

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: yearStart, $lt: yearEnd },
          status: "processing",
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ])

    let totalYearSaleByMonth = []

    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < result.length; j++) {
        const resultElement = result[j]
        const month = resultElement._id
        if (i === month) {
          const monthName = format(new Date(2023, month - 1, 1), "MMMM")
          const totalAmount = resultElement.totalAmount
          totalYearSaleByMonth[i] = { total: totalAmount, month: monthName }
          break // breaks out of the loop, so you don't overwrite totalYearSaleByMonth[i]
        } else {
          const monthName = format(new Date(2023, i, 1), "MMMM")
          totalYearSaleByMonth[i] = { total: 0, month: monthName }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        todaysOrders,
        totalRevenue,
        todaysRevenue,
        totalYearSaleByMonth,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAnalytics }
