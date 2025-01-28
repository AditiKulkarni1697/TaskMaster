const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,},
    due_date: {
        type: Date,
        required: true,
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
});

const TaskModel = mongoose.model("Task",taskSchema);

module.exports = {TaskModel};