const teamValidation = (req, res, next) => {
    const { team_name, members } = req.body;
    if (!team_name) {
        return res.status(400).send({ msg: "Invalid input" });
    }
    next();
};

module.exports = { teamValidation };