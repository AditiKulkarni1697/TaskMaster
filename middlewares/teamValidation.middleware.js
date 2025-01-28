const teamValidation = (req, res, next) => {
    const { team_name, team_lead, members } = req.body;
    if (!team_name || !team_lead) {
        return res.status(400).send({ msg: "Invalid input" });
    }
    next();
};

module.exports = { teamValidation };