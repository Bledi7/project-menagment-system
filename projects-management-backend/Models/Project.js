const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let projectSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    key: {
      type: String,
    },
    listId: {
      type: String,
    },
    boardId: {
      type: String, 
    }
  },
  
{
  collection: "Project",
  }
);

module.exports = mongoose.model("Project", projectSchema);
