const express = require('express')
const reportRoot = express.Router()


// model
let ReportModel = require('../Models/Report')

reportRoot.route('/createReport').post((req, res, next) => {
    ReportModel.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

reportRoot.route('/getReport').get((req, res, next) => {
    ReportModel.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

reportRoot.route('/editReport/:id').get((req, res, next) => {
    ReportModel.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update
reportRoot.route('/updateReport/:id').put((req, res, next) => {
  ReportModel.findByIdAndUpdate(
  req.params.id,
  {
    $set: req.body,
  },
  (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
      console.log('Report successfully updated!')
    }
  },
)
})
// Delete
reportRoot.route('/deleteReport/:id').delete((req, res, next) => {
    ReportModel.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.status(200).json({
        msg: data,
      })
    }
  })
})

module.exports = reportRoot