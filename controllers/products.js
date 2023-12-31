const { default: mongoose } = require("mongoose")
const Product = require("../models/Product")
const Variation = require("../models/variation")
const ErrorResponse = require("../util/ErrorResponse")
const { getAdvancedResults } = require("../util/helper")
const uploadToBucket = require("../util/s3")
const AttributeValue = require("../models/AttributeValue")
const sharp = require("sharp")

//@desc -  Add Product
//@route - POST /api/v1/products
//@access - Private
exports.addProduct = async (req, res, next) => {
  let variations = []

  const { tags, variants, product_type, ...body } = req.body
  if (!req.files.gallery) {
    return next(new ErrorResponse("please upload images to image gallery", 400))
  }
  try {
    // send to S3
    console.log(req.files)
    req.files.image[0].buffer = await sharp(req.files.image[0].buffer)
      .resize(500)
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        force: true,
        quality: 80,
      })
      .toBuffer()
    const imageResult = await uploadToBucket(
      req.files.image[0],
      `product-${req.body.name}`
    )

    // send to S3
    const galleryResult = await Promise.all(
      req.files.gallery.map(async (file, index) => {
        let new_file = file
        new_file.buffer = await sharp(file.buffer)
          .resize(500)
          .png({
            compressionLevel: 9,
            adaptiveFiltering: true,
            force: true,
            quality: 80,
          })
          .toBuffer()
        const result = await uploadToBucket(
          new_file,
          `product-${req.body.name}-${index + 1}`
        )
        return result.Location
      })
    )
    const parsedTags = await JSON.parse(tags)
    if (product_type === "variable") {
      variations = await Promise.all(
        JSON.parse(variants).map(async (variation) => {
          const attr = variation.attributeValues.map((a) => a.value)
          // new variations without product field, to be attached after creating product
          return await new Variation({
            ...variation,
            attributeValue: attr,
          })
        })
      )
    }

    const productValues = {
      ...body,
      image: imageResult.Location,
      gallery: galleryResult,
      tags: parsedTags,
      product_type,
      variants: variations.map((v) => v.id),
    }

    // create product
    const product = await Product.create(productValues)

    // attach product id to variations and SAVE
    const saved = await Promise.all(
      variations.map(async (variation) => {
        variation.product = product._id

        return await variation.save()
      })
    )

    console.log(saved)
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    })
  } catch (error) {
    console.log(error)

    next(error)
  }
}
//@desc -  get all products
//@route - GET /api/v1/products
//@access - Public
exports.getProducts = async (req, res, next) => {
  const config = {}
  try {
    const result = await getAdvancedResults(req, Product, {
      populate: [
        "category",
        "sub_category",
        "tags",
        {
          path: "variants",
          populate: {
            path: "attributeValue",
            populate: "attribute",
          },
        },
      ],
    })

    res.status(200).json({
      ...result,
    })
  } catch (error) {
    next(error)
  }
}
//@desc -  get all products
//@route - GET /api/v1/products/:productId/variations
//@access - Public
exports.getProductsVariations = async (req, res, next) => {
  try {
    const variations = await Variation.find({
      product: req.params.productId,
    }).populate({ path: "attributeValue", populate: "attribute" })
    // const agg = await Variation.aggregate([
    //   {
    //     $match: {
    //       product: new mongoose.Types.ObjectId(req.params.productId),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: AttributeValue.collection.name,
    //       localField: "attributeValue",
    //       foreignField: "_id",
    //       as: "attributeValue",
    //     },
    //   },
    // ])
    res.status(200).json({ success: true, data: variations })
  } catch (error) {
    next(error)
  }
}

//@desc -  get New Arrival products
//@route - GET /api/v1/products/new-arrival
//@access - Public
exports.getNewArrivalProducts = async (req, res, next) => {
  try {
    const result = await getAdvancedResults(req, Product, {
      populate: [
        "category",
        "sub_category",
        "tags",
        {
          path: "variants",
          populate: {
            path: "attributeValue",
            populate: "attribute",
          },
        },
      ],
    })

    res.status(200).json({ success: true, count: result.length, data: result })
  } catch (error) {
    next(error)
  }
}
//@desc -  get Popular products
//@route - GET /api/v1/products/popular-products
//@access - Public
exports.getPopularProducts = async (req, res, next) => {
  try {
    const newProducts = await getAdvancedResults(req, Product, {
      populate: [
        "category",
        "sub_category",
        "tags",
        {
          path: "variants",
          populate: {
            path: "attributeValue",
            populate: "attribute",
          },
        },
      ],
    })
    res
      .status(200)
      .json({ success: true, count: newProducts.length, data: newProducts })
  } catch (error) {
    next(error)
  }
}
//@desc -  get trending products
//@route - GET /api/v1/products/trending
//@access - Public
exports.getTrendingProducts = async (req, res, next) => {
  try {
    const newProducts = await getAdvancedResults(req, Product, {
      populate: [
        "category",
        "sub_category",
        "tags",
        {
          path: "variants",
          populate: {
            path: "attributeValue",
            populate: "attribute",
          },
        },
      ],
    })
    res
      .status(200)
      .json({ success: true, count: newProducts.length, data: newProducts })
  } catch (error) {
    next(error)
  }
}
//@desc -  get recommended products
//@route - GET /api/v1/products/recommended
//@access - Public
exports.getRecommendedProducts = async (req, res, next) => {
  try {
    const newProducts = await getAdvancedResults(req, Product, {
      populate: [
        "category",
        "sub_category",
        "tags",
        {
          path: "variants",
          populate: {
            path: "attributeValue",
            populate: "attribute",
          },
        },
      ],
    })
    res
      .status(200)
      .json({ success: true, count: newProducts.length, data: newProducts })
  } catch (error) {
    next(error)
  }
}
//@desc -  get search products
//@route - GET /api/v1/products/search/:keyword
//@access - Public
exports.searchProducts = async (req, res, next) => {
  let products = []
  if (!req.params.keyword || req.params?.keyword.length === 0) {
    return res
      .status(200)
      .json({ success: true, count: products.length, data: products })
  }
  try {
    products = await Product.find({
      name: { $regex: req.params.keyword, $options: "i" },
    }).limit(10)
    res
      .status(200)
      .json({ success: true, count: products.length, data: products })
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
      .populate("tags")
      .populate({
        path: "variants",
        populate: {
          path: "attributeValue",
          populate: "attribute",
        },
      })
      .populate("sub_category")
      .populate("category")

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

    res
      .status(200)
      .json({ success: true, message: "Deleted Successfully", data: {} })
  } catch (error) {
    next(error)
  }
}
