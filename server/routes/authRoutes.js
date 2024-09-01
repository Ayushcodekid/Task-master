const express = require('express');
const AuthController = require('../controllers/authController');
const TodoController = require("../controllers/todoController")
const router = express.Router();


router.post('/register', AuthController.registeredUser)
router.post('/login', AuthController.loginUser)


router.post('/todos', TodoController.createTodo);
router.get('/todos/:userId', TodoController.getTodos);
router.delete('/todos/:userId/:id', TodoController.deleteTodo);
router.post(`/todos/complete/:userId/:id`, TodoController.completeTodo)
router.get('/todos/completed/:userId', TodoController.getCompletedTodos);
router.put('/todos/:userId/:id', TodoController.updateTodo);

module.exports= router;