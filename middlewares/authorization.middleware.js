const { TeamModel } = require("../databases/mongodb/models/team.model");

const authorization = (roles) => {

    return async (req, res, next) => {
        
        
        if(!roles.includes(req.token.role)){
            return res.status(403).send({msg: "Forbidden"});
        }
       
        
        if(req.token.role === "Team Lead"){
            console.log("team in authorization", req.token._id)
            const team = await TeamModel.findOne({team_lead:req.token._id});
            console.log("team in authorization", team)
            if(team._id.toString() !== req.params.team_id){
                console.log("team._id and req.params.team_id", team._id.toString(), req.params.team_id)
                return res.status(403).send({msg: "Forbidden"});
            }
        }
        next();
    }

}

module.exports = {authorization};