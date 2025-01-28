// Description: Services for task.
const { TeamModel } = require("../databases/mongodb/models/team.model");

const addTaskToTeam = async (teamId, taskId, assigned_to) => { 
    try {
        const team = await TeamModel.findById(teamId);

        if(!team){
            throw new Error("Team not found");
        }
         // Check if all assigned_to users are present in team.members
         const allMembersPresent = assigned_to.every(userId => team.members.includes(userId));
            if (!allMembersPresent) {
                throw new Error("All assigned_to users must be present in team.members");
            }
        
        if(!team.tasks.includes(taskId)){
            team.tasks.push(taskId);
            await TeamModel.findByIdAndUpdate(teamId, team);
        }
        
    } catch (err) {
        throw new Error("Internal Server Error");
     };
    
};

const removeTaskFromTeam = async (teamId, taskId) => {
    try {
        const team = await TeamModel.findById(teamId);

        if(!team){
            return
        }

        if(team.tasks.includes(taskId)){
            team.tasks = team.tasks.filter(task => task !== taskId);    
            await TeamModel.findByIdAndUpdate(teamId, team);
        }
    } catch (err) {
        throw new Error("Internal Server Error");
    }   
};

module.exports = {addTaskToTeam, removeTaskFromTeam};