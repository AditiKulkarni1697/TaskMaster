const { TeamModel } = require("../databases/mongodb/models/team.model");
const { UserModel } = require("../databases/mongodb/models/user.model");

const removeTeamLeadRole = async(teamId) =>{

    const team = await TeamModel.findById(teamId);

    if(!team){
        throw new Error ("Team not found")
    }

    if(team.team_lead){
        try{
        const teamLead = await UserModel.findById(team.team_lead);

        teamLead.role = "Team Member";

        await UserModel.findByIdAndUpdate(team.team_lead, teamLead);
        }catch(err){
             throw new Error("could not remove team lead role")
        }
    }
}

module.exports = {removeTeamLeadRole}