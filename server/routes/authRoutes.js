const express = require('express');
const AuthController = require('../controllers/authController');
const TodoController = require("../controllers/todoController")
const ProjectController = require("../controllers/projectController")
const ChatController = require("../controllers/chatController")
const router = express.Router();


router.post('/register', AuthController.registerdUser)
router.post('/login', AuthController.loginUser)
router.post('/verify-email', AuthController.verifyEmail)


router.post('/todos', TodoController.createTodo);
router.get('/todos/:userId', TodoController.getTodos);
router.delete('/todos/:userId/:id', TodoController.deleteTodo);
router.post(`/todos/complete/:userId/:id`, TodoController.completeTodo)
router.get('/todos/completed/:userId', TodoController.getCompletedTodos);
router.put('/todos/:userId/:id', TodoController.updateTodo);
router.patch('/:taskId/toggle-status', TodoController.toggleTaskStatus);


router.post('/createproject', ProjectController.createProject);
router.post('/projects/add-user', ProjectController.addUserToProject);
router.get('/getprojects/:projectId', ProjectController.getProject);
router.get('/projects/user/:userId', ProjectController.getProjectsByUser);


router.post('/projects/messages', ChatController.sendMessage);
router.get('/projects/chat/:projectId', ChatController.getChatMessages);


module.exports= router;