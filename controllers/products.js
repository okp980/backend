const Product = require("../models/Product")
const ErrorResponse = require("../util/ErrorResponse")
const { deleteFile, getAdvancedResults } = require("../util/helper")

//@desc -  Add Product
//@route - POST /api/v1/products
//@access - Private
exports.addProduct = async (req, res, next) => {
  try {
    const product = await Product.create({ ...req.body, image: req.image.name })
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    })
  } catch (error) {
    await deleteFile("uploads", req.image.name)
    next(error)
  }
}
//@desc -  get all products
//@route - GET /api/v1/products
//@access - Public
exports.getProducts = async (req, res, next) => {
  console.log("query isss", req.query)
  const config = {}
  try {
    const result = await getAdvancedResults(req, Product, config)

    res.status(200).json({
      ...result,
    })
  } catch (error) {
    next(error)
  }
}

//@desc -  get New Arrival products
//@route - GET /api/v1/products/new-arrival
//@access - Public
exports.getNewArrivalProducts = async (req, res, next) => {
  try {
    const newProducts = await Product.find()
    res
      .status(200)
      .json({ success: true, count: newProducts.length, data: newProducts })
  } catch (error) {
    next(error)
  }
}
//@desc -  get Popular products
//@route - GET /api/v1/products/popular-products
//@access - Public
exports.getPopularProducts = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults)
  } catch (error) {
    next(error)
  }
}
//@desc -  get trending products
//@route - GET /api/v1/products/trending
//@access - Public
exports.getTrendingProducts = async (req, res, next) => {
  try {
    const trendingProducts = await Product.find()
    res.status(200).json({
      success: true,
      count: trendingProducts.length,
      data: trendingProducts,
    })
  } catch (error) {
    next(error)
  }
}
//@desc -  get recommended products
//@route - GET /api/v1/products/recommended
//@access - Public
exports.getRecommendedProducts = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults)
  } catch (error) {
    next(error)
  }
}

//@desc -  get all products
//@route - GET /api/v1/products/:id
//@access - Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return new ErrorResponse("Product not found", 404)
    }
    res.status(200).json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

//@desc -  update single Product
//@route - PUT /api/v1/products/:id
//@access - Private
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id)
    if (!product) {
      return new ErrorResponse("Product not found", 404)
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res
      .status(200)
      .json({ success: true, message: "Updated Successfully", data: product })
  } catch (error) {
    next(error)
  }
}

//@desc -  update single Product Image
//@route - PUT /api/v1/products/:id/image
//@access - Private
exports.updateProductImage = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id)
    if (!product) {
      return next(new ErrorResponse("Product not found", 404))
    }
    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        image: req.image.name,
      },
      {
        new: true,
        runValidators: true,
      }
    )
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

//@desc -  delete  Product
//@route - DELETE /api/v1/products/:id
//@access - Private
exports.deleteProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id)
    if (!product) {
      return new ErrorResponse("Product not found", 404)
    }
    const productImage = product.image
    await Product.findByIdAndDelete(req.params.id)
    // Delete image associated with the product from the server
    // await deleteFile("uploads", productImage)

    res
      .status(200)
      .json({ success: true, message: "Deleted Successfully", data: {} })
  } catch (error) {
    next(error)
  }
}
