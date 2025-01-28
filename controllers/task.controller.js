const { TaskModel } = require("../databases/mongodb/models/task.model");

const createTask = async (req, res) => {
  const { title, description, due_date, assigned_to } = req.body;
  try {
    const task = new TaskModel({ title, description, due_date, assigned_to });
    await task.save();
    res.status(201).send({ msg: "Task created successfully" });
  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const payload = req.body;
  try {
    await TaskModel.findByIdAndUpdate(taskId, { payload });
    res.status(200).send({ msg: "Task updated successfully" });
  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    await TaskModel.findByIdAndDelete(taskId);
    res.status(200).send({ msg: "Task deleted successfully" });
  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const getTasks = async (req, res) => {
  const query = {};
  let order = 1;
  if (req.query.status) {
    query.status = req.query.status;
  }
  if (req.query.sort) {
    order = req.query.sort === "desc" ? -1 : 1;
  }
  if (req.query.assigned_to) {
    query.assigned_to = req.query.assigned_to;
  }
  try {
    const tasks = await TaskModel.find(query).sort({ due_date: order });
    res.status(200).send({ data: tasks });
  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

module.exports = { createTask, updateTask, deleteTask, getTasks };
