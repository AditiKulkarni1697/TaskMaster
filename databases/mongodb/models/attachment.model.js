const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
});

const AttachmentModel = mongoose.model('Attachment', attachmentSchema);

module.exports = { AttachmentModel };