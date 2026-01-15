const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new mongoose.Schema({
  title: String,
  leads: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  project: { type: mongoose.Schema.Types.ObjectId, refPath: "Project" },
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
