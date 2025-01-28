const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({ 
    comment: {
        type: String,
        required: true,
    },
    commented_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    commented_on: {
        type: Date,
        default: Date.now,
    },
    attachments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attachment"
        }
    ]
});

const CommentModel = mongoose.model("Comment",commentSchema);

module.exports = {CommentModel};