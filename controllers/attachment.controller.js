const {AttachmentModel} = require('../databases/mongodb/models/attachment.model');
const {CommentModel} = require('../databases/mongodb/models/comment.model');

const createAttachment = async (req, res) => {
    const {url} = req.body;
    const commentId = req.params.comment_id;
    try{
        const newAttachment = new AttachmentModel({url});
        await newAttachment.save();

        const comment = await CommentModel.findOne({_id:commentId});

        comment.attachments.push(newAttachment._id);

        await CommentModel.updateOne({_id:commentId},{attachments:comment.attachments});

        res.status(201).send({msg:"Attachment created successfully"});
    }catch(err){
        res.status(500).send({msg:"Internal Server Error"});
    }
}

const getAttachements = async (req, res) => {
    const commentId = req.params.comment_id;
    try{
        const comment = await CommentModel.findOne({_id:commentId}).populate("attachments");
        if(!comment){
            return res.status(404).send({msg:"Comment not found"});
        }
        res.status(200).send(comment.attachments);
    }catch(err){
        res.status(500).send({msg:"Internal Server Error"});
    }
}

const deleteAttachment = async (req, res) => {
    const attachmentId = req.params.id;
    const commentId = req.params.comment_id;
    try{

        const user = req.user;
        const attachment = await AttachmentModel.findOne({_id:attachmentId});

        if(!attachment){
            return res.status(404).send({msg:"Attachment not found"});
        }

        const comment = await CommentModel.findOne({_id:commentId});

        if(comment.commented_by.toString() !== user._id.toString()){
            return res.status(403).send({msg:"Forbidden"});
        }
        
        await AttachmentModel.deleteOne({_id:attachmentId});
        res.status(200).send({msg:"Attachment deleted successfully"});

    }
    catch(err){
        res.status(500).send({msg:"Internal Server Error"});
    }
}

module.exports = {createAttachment, getAttachements, deleteAttachment};