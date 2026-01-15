const express = require('express')
const projectRoute = express.Router()


// model
let ProjectModel = require('../Models/Project')

projectRoute.route('/createProject').post((req, res, next) => {
    ProjectModel.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

projectRoute.route('/getProject').get((req, res, next) => {
    ProjectModel.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

projectRoute.route('/editProject/:id').get((req, res, next) => {
    ProjectModel.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update
projectRoute.route('/updateProject/:id').put((req, res, next) => {
    ProjectModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
        console.log('Project successfully updated!')
      }
    },
  )
})

// Delete
projectRoute.route('/deleteProject/:id').delete((req, res, next) => {
    ProjectModel.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.status(200).json({
        msg: data,
      })
    }
  })
})

module.exports = projectRoute
