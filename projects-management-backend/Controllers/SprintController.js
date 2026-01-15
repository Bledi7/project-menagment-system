const express = require('express');
const SprintModel = require("../Models/Sprint");
const { getNextSprintId } = require('../Models/Counter');
const sprintRoute = express.Router();



sprintRoute.route("/sprint").post(async (req,res,next) => {
  const {title} = req.body
    try {
        const id = await getNextSprintId()
        const newSprint = new SprintModel({
            id:id,
            title : title
        })
        await newSprint.save()
        res.status(200).json({
            message: "Sprint created successfully",
            sprint : newSprint
          });
    } catch (error) {
        console.error("Failed to create Sprint", error);
        next(error);
    }

})
//delete a sprint by ID
sprintRoute.route("/sprint/:id").delete(async (req, res, next) => {
    const sprintId = req.params.id *1;
    try {
      const deletedSprint = await SprintModel.findOneAndDelete({id : sprintId});
      if (!deletedSprint) {
        return res.status(404).json({ error: "Sprint not found" });
      }
      res.status(200).json({
        message: "Sprint deleted successfully",
        deletedSprint: deletedSprint,
      });
    } catch (error) {
      console.error("Failed to delete sprint:", error);
      next(error);
    }
  });

  // Update a sprint by ID
sprintRoute.route("/sprint/:id").put(async (req, res, next) => {
    const sprintId = req.params.id * 1;
    const { title } = req.body;
    try {
      const updatedSprint = await SprintModel.findOneAndUpdate(
        {id: sprintId},
        { title: title },
        { new: true }
      );
      if (!updatedSprint) {
        return res.status(404).json({ error: "Sprint not found" });
      }
      res.status(200).json({
        message: "Sprint updated successfully",
        updatedSprint: updatedSprint,
      });
    } catch (error) {
      console.error("Failed to update sprint:", error);
      next(error);
    }
  });
  
  // Get a sprint by ID
  sprintRoute.route("/sprint/:id").get(async (req, res, next) => {
    const sprintId = Number(req.params.id);
    try {
      const sprint = await SprintModel.findOne({id : sprintId});
      if (!sprint) {
        return res.status(404).json({ error: "Sprint not found" });
      }
      res.status(200).json({
        message: "Sprint retrieved successfully",
        sprint: sprint,
      });
    } catch (error) {
      console.error("Failed to retrieve sprint:", error);
      next(error);
    }
  });
  
  // Get all sprints
  sprintRoute.route("/sprints").get(async (req, res, next) => {
    try {
      const sprints = await SprintModel.find();
      res.status(200).json({
        message: "Sprints retrieved successfully",
        sprints: sprints,
      });
    } catch (error) {
      console.error("Failed to retrieve sprints:", error);
      next(error);
    }
  });

module.exports = sprintRoute