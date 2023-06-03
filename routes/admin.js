const express = require("express")

const router = express.Router()

const SubCategory = require("../models/SubCategory")

router.get("/dashboard", (req, res) => {
  res.render("dashboard", { title: "Dashboard" })
})
router.get("/categories", (req, res) => {
  res.render("categories", { title: "Dashboard" })
})
router.get("/sub-categories", async (req, res) => {
  try {
    const categories = await SubCategory.find()
    res.render("subcategories", { title: "SubCategory", categories })
  } catch (error) {}
})
router.get("/coupons", (req, res) => {
  res.render("coupons", { title: "Dashboard" })
})
router.get("/customers", (req, res) => {
  res.render("customers", { title: "Dashboard" })
})
router.get("/new-product", (req, res) => {
  res.render("new-product", { title: "Dashboard" })
})
router.get("/order-detail", (req, res) => {
  res.render("order-detail", { title: "Dashboard" })
})
router.get("/orders", (req, res) => {
  res.render("orders", { title: "Dashboard" })
})
router.get("/products", (req, res) => {
  res.render("products", { title: "Dashboard" })
})
router.get("/settings", (req, res) => {
  res.render("settings", { title: "Dashboard" })
})

module.exports = router
