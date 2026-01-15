const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
    index: true,
  },
  firstName: {
    type: String,
    required: true,
    unique: false,
  },
  lastName: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    // default: "defaultRole",
    required: true,
  },
 
  status: {
    type: String,
    default: "pending",
  },
  phoneNumber:{
    type:String,
  },
  address:{
    type:String,
  },
  birthday:{
    type:Date,
  },
  gender:{
    type:String,
  },
  instagram:{
    type:String,
  },
  twitter:{
    type:String,
  },
  gitHub:{
    type:String,
  },
  facebook:{
    type:String,
  },
  profileImage: {
    path: String, // File path where the image is stored on the server
    contentType: String, // MIME type of the image (e.g., image/jpeg)
  },

});

module.exports = mongoose.model("User", userSchema);
