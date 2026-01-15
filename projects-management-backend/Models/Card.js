const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    // sprintId: {
    //   type: Number,
    //   required: false,
    // },
    sprints: [{ type: Number, ref: "Sprint" }],
  },
  {
    collection: "Card",
  }
);

module.exports = mongoose.model("Card", cardSchema);
