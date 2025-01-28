
const taskValidation = (req, res, next) => {
  const { title, description, due_date, assigned_to } = req.body;
  if (!title || !description || !due_date || !assigned_to) {
    return res.status(400).send({ msg: "Missing required fields" });
  }

  if(req.query.sort && req.query.sort !== "desc" && req.query.sort !== "asc"){
    return res.status(400).send({ msg: "Invalid sort value" });
  }

    if(req.query.status && req.query.status !== "incomplete" && req.query.status !== "completed"){
        return res.status(400).send({ msg: "Invalid status value" });
    }

    if(req.query.assigned_to && !mongoose.Types.ObjectId.isValid(req.query.assigned_to)){
        return res.status(400).send({ msg: "Invalid assigned_to value" });
    }
  next();
}

module.exports = { taskValidation };