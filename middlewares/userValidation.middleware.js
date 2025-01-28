const userValidation = async (req,res,next) => {
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.status(400).send({msg:"Missing required fields"});
    }

    next();
}

module.exports = {userValidation};