const express = require('express');

const { createTask, updateTask, deleteTask, getTasks } = require('../controllers/task.controller');
const { authorization } = require('../middlewares/authorization.middleware');
const { authentication } = require('../middlewares/authentication.middleware');
const { taskValidation } = require('../middlewares/taskValidation.middleware');

const taskRouter = express.Router();

taskRouter.post('/:team_id',authentication, authorization(["Project Manager", "Team Lead"]), taskValidation ,createTask);

taskRouter.put('/:team_id/:id',authentication, authorization(["Project Manager", "Team Lead"]), taskValidation, updateTask);

taskRouter.delete('/:team_id/:id',authentication, authorization(["Project Manager", "Team Lead"]), deleteTask);

taskRouter.get('/',authentication, getTasks);

module.exports = { taskRouter };