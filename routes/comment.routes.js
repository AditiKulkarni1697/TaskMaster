const express = require("express");
const { authentication } = require("../middlewares/authentication.middleware");
const { createComment, deleteComment, getComments } = require("../controllers/comment.controller");

const commentRouter = express.Router();

commentRouter.post("/:task_id",authentication, createComment);

commentRouter.get("/:task_id",authentication, getComments);

commentRouter.delete("/:id",authentication, deleteComment);

module.exports = {commentRouter};