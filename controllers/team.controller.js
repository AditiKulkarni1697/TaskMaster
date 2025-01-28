
const {TeamModel} = require("../databases/mongodb/models/team.model");

const createTeam = async (req, res) => {    
    const {team_name,team_lead,members} = req.body;
    try {
        const team = new TeamModel({team_name,team_lead,members});
        await team.save();
        res.status(201).send({ msg: "Team created successfully" });
    } catch (err) {
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
        await TeamModel.findByIdAndUpdate(teamId, { payload });
        res.status(200).send({ msg: "Team updated successfully" });
    } catch (err) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
};

const deleteTeam = async (req, res) => {
    const teamId = req.params.id;
    try {
        await TeamModel.findByIdAndDelete(teamId);  
        res.status(200).send({ msg: "Team deleted successfully" }); 
    } catch (err) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = { createTeam, getTeam, getAllTeams, updateTeam, deleteTeam };