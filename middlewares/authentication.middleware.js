const jwt = require('jsonwebtoken');
const { UserModel } = require('../databases/mongodb/models/user.model');
require("dotenv").config();

const authentication = async (req, res, next) => {

    const { authorization } = req.headers;
    
    if(!authorization){
        return res.status(401).send({msg: "Unauthorized"});
    }

    const token = authorization.split(" ")[1];
    
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).send({msg: "Unauthorized"});
        }

        const user = await UserModel.findOne({email: decoded.email});

        if(!user){
            return res.status(401).send({msg: "Unauthorized"});
        }
        req.user = user;
        next();
        
    }catch(err){
        return res.status(500).send({msg: "Internal Server Error"});
    }
}

module.exports = {authentication};