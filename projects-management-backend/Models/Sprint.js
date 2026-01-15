const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const cardSchema = new Schema(
//   {
//     id: {
//       type: Number,
//       unique: true,
//       required: true,
//       index: true,
//     },
//     title: {
//       type: String,
//       required: true,
//     },
//     sprintId: {
//       type: Number,
//       required: false,
//     },
//   },
//   {
//     collection: "Card",
//   }
// );

const sprintSchema = new Schema(
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
    // cards: [cardSchema],
  },
  {
    collection: "Sprints",
  }
);

const Sprint = mongoose.model("Sprint", sprintSchema);

module.exports = Sprint;
