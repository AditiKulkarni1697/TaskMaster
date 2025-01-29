const express = require("express");
const { authentication } = require("../middlewares/authentication.middleware");
const { createAttachment, getAttachements, deleteAttachment } = require("../controllers/attachment.controller");

const attachmentRouter = express.Router();

attachmentRouter.post("/:comment_id",authentication, createAttachment);

attachmentRouter.get("/:comment_id",authentication, getAttachements);

attachmentRouter.delete("/:comment_id/:id",authentication, deleteAttachment);

module.exports = {attachmentRouter};