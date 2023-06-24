const advancedResults =
  (model, populate, useUser = false) =>
  async (req, res, next) => {
    try {
      let query

      let queryStr = JSON.stringify(req.query)
      queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
      )

      // parsed query

      queryStr = JSON.parse(queryStr)

      // fields to remove
      const removeFields = ["select", "sort", "page", "limit"]

      removeFields.forEach((item) => {
        if (queryStr[item]) {
          delete queryStr[item]
        }
      })

      // check useUser
      if (useUser) {
        query = model.find({ user: req.user.id, ...queryStr })
      } else {
        query = model.find(queryStr)
      }

      // select field
      if (req.query.select) {
        const fields = req.query.select.split(",").join(" ")
        query.select(fields)
      }

      // sort by
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ")
        query.sort(sortBy)
      } else {
        query.sort("-createdAt")
      }

      // Pagination
      const page = parseInt(req.query.page, 10) || 1
      const limit = parseInt(req.query.limit, 10) || 5
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const total = await model.countDocuments()

      query = query.skip(startIndex).limit(limit)

      const pagination = { current: page, limit }

      if (endIndex < total) {
        pagination.next = {
          page: page + 1,
          limit,
        }
      }

      if (startIndex > 0) {
        pagination.previous = {
          page: page - 1,
          limit,
        }
      }

      // populate field
      if (populate) {
        query = query.populate(populate)
      }

      // execute query
      const result = await query

      res.advancedResults = {
        success: true,
        count: result.length,

        pagination,
        data: result,
      }
      next()
    } catch (error) {
      next(error)
    }
  }

module.exports = advancedResults
