const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {type:String,required:true, minLength: 3, maxLength: 50},
  email: {type:String,required:true, unique:true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("invalid email id")
      }
    }
  },
  password: {type:String,required:true, 
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error ("This is not a strong password")
      }
    }
  },
  role: {type:String, enum:["Project Manager", "Team Lead", "Team Member"], default:"Team Member"},  
}, {timestamps: true})

const UserModel = mongoose.model("User", userSchema);

module.exports = {UserModel};