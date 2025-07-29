const mongoose = require('mongoose');
const validator = require("validator");

const attachmentSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("invalid url");
            }
        }
    },
});

const AttachmentModel = mongoose.model('Attachment', attachmentSchema);

module.exports = { AttachmentModel };