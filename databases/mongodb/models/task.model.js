const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 3,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        minLength: 3,
        maxlength: 100
    },
    due_date: {
        type: Date,
        required: true,
        validate(value){
          if(!validator.isDate(value)){
            throw new Error("provide date in YYYY/MM/DD format")
          }
        }
    },
    assigned_to: [
        {type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,}
    ],
    status: {
        type: String,
        enum: ["incomplete","completed"],
        default: "incomplete",
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ]
}, {timestamps:true});

const TaskModel = mongoose.model("Task",taskSchema);

module.exports = {TaskModel};