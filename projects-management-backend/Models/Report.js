const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let reportSchema = new Schema(
  {
    id: {
      type: Number,
    },
    userName:{
      type:String,
    },
    date: {
      type: Date,
    },
    report: {
      type: String,
    },
    isFavorite:{
      type:Boolean,
    },
    isRead:{
      type:Boolean,
    }
  },
  {
    collection: "Reports",
  }
);

module.exports = mongoose.model("Report", reportSchema);