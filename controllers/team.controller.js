
const {TeamModel} = require("../databases/mongodb/models/team.model");
const { removeTeamLeadRole } = require("../services/team.services");

const createTeam = async (req, res) => {    
    const payload = req.body;
    try {
        const team = new TeamModel(payload);
        await team.save();
        res.status(201).send({ msg: "Team created successfully" });
    } catch (err) {
        console.log("error in createTeam", err)
        res.status(500).send({ msg: "Internal Server Error" });
    }
}

const getTeam = async (req, res) => {
    const team_id = req.params.id;

    try{
        const team = await TeamModel.findById(team_id);
        res.status(200).send({ data: team });
    }catch(err){
        res.status(500).send({ msg: "Internal Server Error" });
    }
}

const getAllTeams = async (req,res)=>{
    try{
        const teams = await TeamModel.find({}, {team_name:1,team_lead:1});
        res.status(200).send({data:teams});
    }catch(err){
        res.status(500).send({msg:"Internal Server Error"});
    }
};

const updateTeam = async (req, res) => {
    const teamId = req.params.id;
    const payload = req.body;

    try {

        if(payload.team_lead){
            return res.status(400).send({msg:"update team lead using updateRole endpoint"})
        }
        await TeamModel.findByIdAndUpdate(teamId, payload);
        res.status(200).send({ msg: "Team updated successfully" });
    } catch (err) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
};

const deleteTeam = async (req, res) => {
    const teamId = req.params.id;
    try {
        await removeTeamLeadRole(teamId)
        await TeamModel.findByIdAndDelete(teamId);  
        res.status(200).send({ msg: "Team deleted successfully" }); 
    } catch (err) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = { createTeam, getTeam, getAllTeams, updateTeam, deleteTeam };