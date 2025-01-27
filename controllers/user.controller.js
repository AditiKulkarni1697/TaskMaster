const {UserModel} = require("../databases/mongodb/models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req,res) => {
    const {name,email,password,role} = req.body;
    try{
       const hashed = await bcrypt.hash(password,8);

       const alreadyPresent = await UserModel.findOne({email:email});

       if(alreadyPresent){
           return res.status(400).json({message:"User already exists"});
       }

       const user = new UserModel({name,email,password:hashed,role});

       await user.save();

       res.status(201).send({msg:"User created successfully"});
    }catch(err){
      res.status(500).send({msg:"Internal Server Error"});
    }
}

const loginUser = async (req,res) => {
  const {email,password} = req.body;

  try{

    const isPresent = await UserModel.findOne({email:email});

    if(!isPresent){
        return res.status(400).send({msg:"Invalid Credentials"});
    }

    const isValid = await bcrypt.compare(password, isPresent.password);

    if(!isValid){
        return res.status(400).send({msg:"Invalid Credentials"});
    }

    const token = jwt.sign({email:isPresent.email, role: isPresent.role}, process.env.JWT_SECRET);

    res.status(200).send({msg:"Logged in successfully", token});

  }catch(err){
    res.status(500).send({msg:"Internal Server Error"});
  }
}
module.exports = {createUser, loginUser};