// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');
// require('dotenv').config(); // To load environment variables
// const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Use the environment variable

// // Create a new user
// async function registeredUser(req, res) {
//     try {
//         const { email, username, password } = req.body;
//         const user = await User.create({ email, username, password });
//         res.status(201).send({message:"User registered successfully", user});
//     } catch (error) {
//         res.status(500).send({ message: 'Error creating user', error });
//     }
// }

// // Login user (password comparison & JWT token generation)
// async function loginUser(req, res) {
//     try {
//         const { username, password } = req.body;
//         const user = await User.findOne({ where: { username } });

//         if (!user) {
//             return res.status(404).send({ message: 'User not found' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).send({ message: 'Invalid password' });
//         }

//         // Generate JWT token
//         const jwtToken  = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
//             expiresIn: '1h' // Token expires in 1 hour
//         });
//         console.log('User ID:', user.id);
//         res.send({ message: 'Login successful', token: jwtToken, userId: user.id , username: user.username});
        
//     } catch (error) {
//         res.status(500).send({ message: 'Error logging in', error });
//     }
// }






// async function googleLogin(req, res) {
//     try {
//       const { token } = req.body;
      
//       const ticket = await client.verifyIdToken({
//         idToken: token,
//         audience: process.env.GOOGLE_CLIENT_ID,
//       });
//       const payload = ticket.getPayload();
  
//       const googleId = payload['sub'];
//       const email = payload['email'];
//       const username = payload['name'];
  
//       let user = await User.findOne({ where: { email } });
      
//       if (!user) {
//         user = await User.create({
//           id: googleId,
//           email,
//           username,
//           password: null,
//         });
//       }
  
//       console.log('JWT Secret:', process.env.JWT_SECRET); 
  
//       // Ensure JWT_SECRET is loaded correctly
//       if (!process.env.JWT_SECRET) {
//         throw new Error("JWT_SECRET is not defined in the environment variables");
//       }
  
//       const jwtToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
//         expiresIn: '1h',
//       });
  
//       res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
//       res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  
//       res.json({ success: true, userId: user.id, token: jwtToken, username: user.username });
//     } catch (error) {
//       console.error("Google login failed:", error);
//       res.status(400).json({ success: false, message: 'Google login failed' });
//     }
//   }
  

// module.exports = { registeredUser, loginUser, googleLogin};





















// const bcrypt = require('bcryptjs');
// const { OAuth2Client } = require('google-auth-library');

// const jwt = require('jsonwebtoken');
// const User = require('../models/user');
// require('dotenv').config(); // To load environment variables


// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// // Create a new user
// async function registeredUser(req, res) {
//     try {
//         const { email, username, password } = req.body;

//         // Create the user in the database
//         const user = await User.create({ email, username, password });

//         // Generate JWT token for the newly registered user
//         const token = jwt.sign(
//             { id: user.id, username: user.username }, // Payload: user id and username
//             process.env.JWT_SECRET,                    // Secret key for signing the token
//             { expiresIn: '1h' }                       // Set the token to expire in 1 hour (adjust as needed)
//         );

//         // Send the response back to the frontend
//         res.status(201).send({
//             message: "User registered successfully",
//             user: {
//                 id: user.id,
//                 username: user.username,
//                 email: user.email
//             },
//             token: token // Send the token along with the user details
//         });

//     } catch (error) {
//         console.error('Error during user registration:', error);
//         res.status(500).send({ message: 'Error creating user', error: error.message });
//     }
// }





// async function loginUser(req, res) {
//     try {
//         const { username, password, credential, tokenId } = req.body;

//         // Case 1: Google OAuth login
//         const googleToken = credential || tokenId; // Use either `credential` or `tokenId`
//         if (googleToken) {
//             console.log('Google login detected');

//             try {
//                 // Verify Google token
//                 const ticket = await client.verifyIdToken({
//                     idToken: googleToken,
//                     audience: process.env.GOOGLE_CLIENT_ID, // Ensure this matches your Google OAuth client ID
//                 });

//                 const { sub: providerId, email, name: username } = ticket.getPayload();

//                 console.log('Google token verified:', { providerId, email, username });

//                 // Check if user already exists in the database
//                 let user = await User.findOne({ where: { providerId, authProvider: 'google' } });

//                 if (!user) {
//                     console.log('User not found. Creating a new user...');
//                     user = await User.create({
//                         username,
//                         email,
//                         providerId,
//                         authProvider: 'google',
//                         password: null, // Set password to null for Google login
//                     });
//                     console.log('New user created:', user);
//                 } else {
//                     console.log('User already exists:', user);
//                 }

//                 // Generate JWT token for the user
//                 const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
//                     expiresIn: '1h',
//                 });

//                 console.log('Google login successful, sending response');
//                 return res.json({ message: 'Google login successful', token, userId: user.id, username: user.username });
//             } catch (error) {
//                 console.error('Error during Google token verification:', error);
//                 return res.status(500).json({ message: 'Google login failed', error: error.message });
//             }
//         }

//         // Case 2: Standard login with username and password
//         if (username && password) {
//             const user = await User.findOne({ where: { username } });

//             if (!user) {
//                 console.log('User not found:', username);
//                 return res.status(404).json({ message: 'User not found' });
//             }

//             // Check password if the user is not logged in via Google
//             if (user.authProvider !== 'google') {
//                 const isMatch = await bcrypt.compare(password, user.password);
//                 if (!isMatch) {
//                     console.log('Invalid password for user:', username);
//                     return res.status(401).json({ message: 'Invalid password' });
//                 }
//             }

//             // Generate JWT token for user
//             const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
//                 expiresIn: '1h',
//             });

//             console.log('Standard login successful, sending response');
//             return res.json({ message: 'Login successful', token, userId: user.id, username: user.username });
//         }

//         // If neither Google token nor standard login credentials are provided
//         return res.status(400).json({ message: 'Invalid login credentials' });

//     } catch (error) {
//         console.error('Error logging in:', error);
//         res.status(500).json({ message: 'Error logging in', error: error.message });
//     }
// }





// async function googleLogin(req, res) {
//     try {
//         console.log('Incoming request for Google login:', req.body);

//         const { credential  } = req.body;

//         if (!credential ) {
//             console.error('No tokenId provided in the request');
//             return res.status(400).json({ message: 'TokenId is required' });
//         }

//         // Verify Google token
//         console.log('Verifying Google token...');
//         const ticket = await client.verifyIdToken({
//             idToken: credential ,
//             audience: process.env.GOOGLE_CLIENT_ID, // Make sure this is correct
//         });

//         console.log('Google token verified:', ticket);

//         const { sub: providerId, email, name: username } = ticket.getPayload();

//         // Check if the user already exists
//         console.log(`Checking if user with providerId ${providerId} exists...`);
//         let user = await User.findOne({ where: { providerId, authProvider: 'google' } });

//         if (!user) {
//             // Create a new user if one does not exist
//             console.log('User not found. Creating a new user...');
//             user = await User.create({
//                 username,
//                 email,
//                 providerId,
//                 authProvider: 'google',
//                 password: null, // Set password to null for Google login
//             });
//             console.log('New user created:', user);
//         } else {
//             console.log('User already exists:', user);
//         }

//         // Generate JWT token for the user
//         console.log('Generating JWT token for user...');
//         const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
//             expiresIn: '1h',
//         });

//         console.log('JWT token generated:', token);

//         // Set Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy headers
//         res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
//         res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
//         res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your frontend URL if different
//         res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//         res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

//         // Send the JWT token back to the frontend
//         res.json({ message: 'Google login successful', token, userId: user.id, username: user.username });
//     } catch (error) {
//         console.error('Error during Google OAuth:', error);
//         res.status(500).json({ message: 'Google login failed', error: error.message });
//     }
// }

// module.exports = { registeredUser, loginUser, googleLogin };









//login code

// Login function for standard and Google login
// async function loginUser(req, res) {
//     try {
//         const { username, password, credential, email } = req.body;

//         // Check if Google credential is provided
//         if (credential) {
//             try {
//                 const { sub: providerId, email, name } = await verifyGoogleToken(credential);

//                 let user = await User.findOne({ where: { providerId, authProvider: 'google' } });
//                 if (!user) {
//                     user = await User.create({
//                         username: name,
//                         email,
//                         providerId,
//                         authProvider: 'google',
//                         password: null,
//                     });
//                 }

//                 const token = generateToken(user);
//                 return res.json({ message: 'Google login successful', token, userId: user.id, username: user.username });
//             } catch (error) {
//                 console.error('Error during Google token verification:', error);
//                 return res.status(500).json({ message: 'Google login failed', error: error.message });
//             }
//         }

//         // Standard login with username and password
//         if (username && password) {
//             const user = await User.findOne({ where: { username } });

//             if (!user) {
//                 return res.status(404).json({ message: 'User not found' });
//             }

//             if(user.authProvider === 'google') {
//                 return res.status(401).json({ message: 'Please log in using Google' });
//             }

            

//             if (user.authProvider !== 'google') {
//                 const isMatch = await bcrypt.compare(password, user.password);
//                 if (!isMatch) {
//                     return res.status(403).json({ message: 'Invalid password' });
//                 }
//             }

//             const token = generateToken(user);
//             return res.json({ message: 'Login successful', token, userId: user.id, username: user.username });
//         }

//         // If neither Google token nor username-password is provided
//         return res.status(400).json({ message: 'Invalid login credentials' });
//     } catch (error) {
//         console.error('Error logging in:', error);
//         res.status(500).json({ message: 'Error logging in', error: error.message });
//     }
// }



























const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
function generateToken(user) {
    return jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

// Handle Google token verification
async function verifyGoogleToken(credential) {
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
}

// Register a new user
async function registeredUser(req, res) {
    try {
        const { email, username, password } = req.body;

        // Check if the username or email already exists before creating the user
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: "Username is already taken. Please choose another." });
        }

        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        const user = await User.create({ email, username, password });
        const token = generateToken(user);

        res.status(201).json({
            message: "User registered successfully",
            user: { id: user.id, username: user.username, email: user.email },
            token
        });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}






async function loginUser(req, res) {
    try {
        const { username, password, credential, email } = req.body;

        // Check if Google credential is provided
        if (credential) {
            try {
                const { sub: providerId, email, name } = await verifyGoogleToken(credential);

                let user = await User.findOne({ where: { providerId, authProvider: 'google' } });
                if (!user) {
                    user = await User.create({
                        username: name,
                        email,
                        providerId,
                        authProvider: 'google',
                        password: null,
                    });
                }

                const token = generateToken(user);
                return res.json({ message: 'Google login successful', token, userId: user.id, username: user.username });
            } catch (error) {
                console.error('Error during Google token verification:', error);
                return res.status(500).json({ message: 'Google login failed', error: error.message });
            }
        }

        // Standard login with either username or email and password
        if ((username || email) && password) {
            let user;

            // If username is provided, search by username
            if (username) {
                user = await User.findOne({ where: { username } });
            } 
            // If email is provided, search by email
            else if (email) {
                user = await User.findOne({ where: { email } });
            }

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // If the user is logged in through Google, don't check the password
            if (user.authProvider === 'google') {
                return res.status(401).json({ message: 'Please log in using Google' });
            }

            // Check the password if it's not a Google login
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(403).json({ message: 'Invalid password' });
            }

            const token = generateToken(user);
            return res.json({ message: 'Login successful', token, userId: user.id, username: user.username });
        }

        // If neither Google token nor username/email and password is provided
        return res.status(400).json({ message: 'Invalid login credentials' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
}




module.exports = { registeredUser, loginUser };











