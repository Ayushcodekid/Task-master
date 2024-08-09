const express = require('express');
const AuthController = require('../controllers/authController');
const router = express.Router();


router.post('/register', AuthController.registeredUser)
router.post('/login', AuthController.loginUser)

module.exports= router;