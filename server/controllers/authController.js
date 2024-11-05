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
        res.send({ message: 'Login successful', token, userId: user.id , username: user.username});
    } catch (error) {
        res.status(500).send({ message: 'Error logging in', error });
    }
}



// // Fetch user details by userId
// async function getUserDetails(req, res) {
//     const { userId } = req.params;

//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Only return necessary fields like username and email
//         res.json({
//             userId: user._id,
//             username: user.username,
//             email: user.email, // Include other fields if needed
//         });
//     } catch (error) {
//         console.error('Error fetching user details:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }

module.exports = { registeredUser, loginUser };
