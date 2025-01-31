const jwt = require('jsonwebtoken');
const { UserModel } = require('../databases/mongodb/models/user.model');
const { BlacklistModel } = require('../databases/mongodb/models/blacklist.model');
require("dotenv").config();

const authentication = async (req, res, next) => {

    const { authorization } = req.headers;
    
    if(!authorization){
        return res.status(401).send({msg: "Unauthorized"});
    }

    const token = authorization;
    
    try{

        const isBlacklisted = await BlacklistModel.findOne({token});

        if(isBlacklisted){
            return res.status(401).send({msg: "Unauthorized"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).send({msg: "Unauthorized"});
        }

        const user = await UserModel.findOne({_id: decoded.user._id});

        if(!user){
            return res.status(401).send({msg: "Unauthorized"});
        }
        req.token = decoded.user;
        next();
        
    }catch(err){
        console.log("error in authentication", err)
        return res.status(500).send({msg: "Internal Server Error"});
    }
}

module.exports = {authentication};