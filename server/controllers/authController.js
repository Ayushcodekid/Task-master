const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config(); // To load environment variables

// Create a new user
async function registeredUser(req, res) {
    try {
        const { email, username, password } = req.body;
        const user = await User.create({ email, username, password });
        res.status(201).send({message:"User registered successfully", user});
    } catch (error) {
        res.status(500).send({ message: 'Error creating user', error });
    }
}

// Login user (password comparison & JWT token generation)
async function loginUser(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h' // Token expires in 1 hour
        });
        console.log('User ID:', user.id);
        res.send({ message: 'Login successful', token, userId: user.id });
    } catch (error) {
        res.status(500).send({ message: 'Error logging in', error });
    }
}

module.exports = { loginUser, registeredUser };
