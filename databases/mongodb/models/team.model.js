const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({    
    team_name: {
        type: String,
        required: true,
    },
    team_lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
        }
    ]
});

const TeamModel = mongoose.model("Team",teamSchema);

module.exports = {TeamModel};