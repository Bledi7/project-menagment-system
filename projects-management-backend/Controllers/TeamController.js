const express = require("express");
const teamRoute = express.Router();
const Team = require("../Models/Team");

teamRoute.put("/teams/:id", async (req, res) => {
  try {
    const teamId = req.params.id;
    const updatedTeam = await Team.findByIdAndUpdate(teamId, req.body, {
      new: true,
    });

    if (!updatedTeam) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(500).json({ error: "Error updating team" });
  }
});

teamRoute.post("/teams", async (req, res) => {
  try {
    const newTeam = new Team(req.body);
    const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ error: "Error creating team" });
  }
});

teamRoute.get("/teams-by-project", async (req, res) => {
  try {
    const teamsByProject = await Team.aggregate([
      {
        $lookup: {
          from: "Project",
          localField: "project",
          foreignField: "_id",
          as: "projectDetails",
        },
      },
      {
        $unwind: "$leads",
      },
      {
        $group: {
          _id: "$project",
          project: { $first: { $arrayElemAt: ["$projectDetails", 0] } },
          teams: { $addToSet: "$title" }, // Create an array of team titles
        },
      },
      {
        $project: {
          _id: 0,
          project: {
            _id: 1,
            title: 1,
            status: 1,
            startDate: 1,
            progress: 1,
            key: 1,
            __v: 1,
          },
          teams: {
            $filter: {
              input: "$teams",
              as: "team",
              cond: { $ne: ["$$team", null] },
            },
          },
        },
      },
    ]);

    res.status(200).json(teamsByProject);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving teams by project" });
  }
});
teamRoute.get("/teams", async (req, res) => {
  try {
    const teams = await Team.find()
      .populate({
        path: "leads employees",
        model: "User",
      })
      .populate({
        path: "project",
        model: "Project",
        select: "title",
      })
      .exec();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ error: "Error fetching teams" });
  }
});
teamRoute.get("/teams/with-lead", async (req, res) => {
  try {
    const leadId = req.query.leadId;

    if (!leadId) {
      return res.status(400).json({
        message:
          "Please provide a leadId in the request body or query parameters.",
      });
    }

    // Find teams where the leadId is in the leads array
    const teams = await Team.find({ leads: leadId })
      .populate({
        path: "leads employees",
        model: "User",
      })
      .exec();

    if (!teams || teams.length === 0) {
      return res
        .status(404)
        .json({ message: "No teams found with this lead ID." });
    }

    return res.json(teams);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

teamRoute.get("/teams/of-employee", async (req, res) => {
  try {
    const employeeId = req.query.employeeId;

    if (!employeeId) {
      return res.status(400).json({
        message:
          "Please provide a employeeId in the request body or query parameters.",
      });
    }

    // Find teams where the employeeId is in the employee array
    const employees = await Team.find({ employees: employeeId })
      .populate({
        path: "leads employees",
        model: "User",
      })
      .populate({
        path: "project",
        model: "Project",
      })
      .exec();

    if (!employees || employees.length === 0) {
      return res
        .status(404)
        .json({ message: "No employees found with this lead ID." });
    }

    return res.json(employees);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

teamRoute.delete("/teams/:id", async (req, res) => {
  try {
    const teamId = req.params.id;
    console.log("Deleting team with ID:", teamId);

    const deletedTeam = await Team.findByIdAndDelete(teamId);

    if (!deletedTeam) {
      console.log("Team not found for deletion");
      return res.status(404).json({ error: "Team not found" });
    }

    console.log("Team deleted successfully");
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ error: "Error deleting team" });
  }
});

module.exports = teamRoute;
