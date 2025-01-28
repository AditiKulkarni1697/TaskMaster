
const authorization = (roles) => {

    return async (req, res, next) => {

        if(!roles.includes(req.user.role)){
            return res.status(403).send({msg: "Forbidden"});
        }
        if(roles.includes("Team Lead")){
            const team = await TeamModel.findOne({team_lead:req.user.email});
            if(team._id !== req.params.team_id){
                return res.status(403).send({msg: "Forbidden"});
            }
        }
        next();
    }

}

module.exports = {authorization};