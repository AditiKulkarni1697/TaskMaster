const userValidation = async (req,res,next) => {
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.status(400).send({msg:"Missing required fields"});
    }

    if(name.length < 3 || name.length > 50){
        return res.status(400).send({msg:"Name must be between 3 to 50 characters"});
    }

    const emailRegex = "^[^\s@]+@[^\s@]+\.[^\s@]+$";
    if(!emailRegex.test(email)){
        return res.status(400).send({msg:"Invalid email"});
    }

    if(password.length < 8 || password.length > 50){
        return res.status(400).send({msg:"Password must be between 8 to 50 characters"});
    }

    next();
}

module.exports = {userValidation};