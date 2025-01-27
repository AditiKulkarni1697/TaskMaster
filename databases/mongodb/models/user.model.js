const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {type:String,required:true},
  email: {type:String,required:true, unique:true},
  password: {type:String,required:true},
  role: {type:String, enum:["Project Manager", "Team Lead", "Team Member"], default:"Team Member"},  
})

const UserModel = mongoose.model("User", userSchema);

module.exports = {UserModel};