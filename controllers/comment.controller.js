const {CommentModel} = require("../databases/mongodb/models/comment.model");
const { TaskModel } = require("../databases/mongodb/models/task.model");

const createComment = async (req, res) => {
    const {comment} = req.body;
    const taskId = req.params.task_id;
    try{

        const newComment = new CommentModel({comment,commented_by:req.user._id});
        await newComment.save();

        const task = await TaskModel.findOne({_id:taskId});

        if(!task){
            return res.status(404).send({msg:"Task not found"});
        }

        task.comments.push(newComment._id);
        
        await TaskModel.updateOne({_id:taskId},{comments:task.comments});

        res.status(201).send({msg:"Comment created successfully"});
    }catch(err){
        res.status(500).send({msg:"Internal Server Error"});
    }
}

const getComments = async (req, res) => {
    const taskId = req.params.task_id;
    try{
        const task = await TaskModel.findOne({_id:taskId}).populate("comments");
        if(!task){
            return res.status(404).send({msg:"Task not found"});
        }
        res.status(200).send(task.comments);
    }
    catch(err){
        res.status(500).send({msg:"Internal Server Error"});
    }
}

const deleteComment = async (req, res) => {
    const commentId = req.params.id;
    try{

        const user = req.user;

        const comment = await CommentModel.findOne({_id:commentId});
        if(!comment){
            return res.status(404).send({msg:"Comment not found"});
        }

        if(comment.commented_by.toString() !== user._id.toString()){
            return res.status(403).send({msg:"Forbidden"});
        }
        
        await CommentModel.deleteOne({_id:commentId});
        res.status(200).send({msg:"Comment deleted successfully"});
    }catch(err){
        res.status(500).send({msg:"Internal Server Error"});
    }
}      


module.exports = {createComment,getComments, deleteComment};