
// const bcrypt = require('bcryptjs');
// const { OAuth2Client } = require('google-auth-library');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// // Generate JWT token
// function generateToken(user) {
//     return jwt.sign(
//         { id: user.id, username: user.username },
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' }
//     );
// }




// // Handle Google token verification
// async function verifyGoogleToken(credential) {
//     const ticket = await client.verifyIdToken({
//         idToken: credential,
//         audience: process.env.GOOGLE_CLIENT_ID,
//     });
//     return ticket.getPayload();
// }

// // Register a new user
// async function registeredUser(req, res) {
//     try {
//         const { email, username, password } = req.body;

//         // Check if the username or email already exists before creating the user
//         // const existingUser = await User.findOne({ where: { username } });
//         // if (existingUser) {
//         //     return res.status(400).json({ message: "Username is already taken. Please choose another." });
//         // }

//         const existingEmail = await User.findOne({ where: { email } });
//         if (existingEmail) {
//             return res.status(400).json({ message: "Email is already registered." });
//         }


//         // Generate a verification code
//         const verificationCode = crypto.randomBytes(3).toString('hex'); // Example code format

//         // Create the user with verification code and set `verified` to false
//         const user = await User.create({
//             email,
//             username,
//             password,
//             verificationCode,
//             verified: false // User not verified initially
//         });


//         await sendVerificationEmail(user.email, verificationCode);


//         const token = generateToken(user);



//         res.status(201).json({
//             message: "User registered successfully. Please check your email to verify your account.",
//             user: { id: user.id, username: user.username, email: user.email },
//             token
//         });
//     } catch (error) {
//         console.error('Error during user registration:', error);
//         res.status(500).json({ message: 'Error creating user', error: error.message });
//     }
// }



// // Function to send verification email
// async function sendVerificationEmail(email, verificationCode) {
//     const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//         }
//     });

//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'Account Verification',
//         text: `Please verify your account by entering the following code: ${verificationCode}`
//     };

//     await transporter.sendMail(mailOptions);
// }




// async function verifyEmail(req, res) {
//     try {
//         const { email, code } = req.body;

//         // Find the user by email
//         const user = await User.findOne({ where: { email } });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         if (user.verified) {
//             return res.status(400).json({ message: "User is already verified" });
//         }

//         // Check if the code matches
//         if (user.verificationCode === code) {
//             user.verified = true; // Mark user as verified
//             user.verificationCode = null; // Clear the verification code after use
//             await user.save();

//             return res.json({ message: "Account verified successfully" });
//         } else {
//             return res.status(400).json({ message: "Invalid verification code" });
//         }
//     } catch (error) {
//         console.error('Error during email verification:', error);
//         res.status(500).json({ message: 'Error verifying account', error: error.message });
//     }
// }





// async function loginUser(req, res) {
//     try {
//         const { password, credential, email } = req.body;

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
//                         verified: true,  // Set verified to true for Google users
//                         verificationCode: false,
//                     });
//                 }

//                 const token = generateToken(user);
//                 return res.json({ message: 'Google login successful', token, userId: user.id, username: user.username });
//             } catch (error) {
//                 console.error('Error during Google token verification:', error);
//                 return res.status(500).json({ message: 'Google login failed', error: error.message });
//             }
//         }

//         // Standard email and password login
//         if (email && password) {
//             // Find user by email
//             const user = await User.findOne({ where: { email } });

//             if (!user) {
//                 return res.status(404).json({ message: 'User not found' });
//             }

//             // Ensure users registered with Google cannot use password login
//             if (user.authProvider === 'google') {
//                 return res.status(401).json({ message: 'Please log in using Google' });
//             }

//             // Check the password if it's not a Google login
//             const isMatch = await bcrypt.compare(password, user.password);
//             if (!isMatch) {
//                 return res.status(403).json({ message: 'Invalid password' });
//             }

//             const token = generateToken(user);
//             return res.json({ message: 'Login successful', token, userId: user.id, username: user.username });
//         }

//         // If neither Google token nor username/email and password is provided
//         return res.status(400).json({ message: 'Invalid login credentials' });
//     } catch (error) {
//         console.error('Error logging in:', error);
//         res.status(500).json({ message: 'Error logging in', error: error.message });
//     }
// }








// module.exports = { registeredUser, loginUser, verifyEmail};




















const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const sequelize = require('../db'); // Correct import for default export

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Function to generate JWT token
function generateToken(user) {
    return jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
    );
}




// Verify Google token
async function verifyGoogleToken(credential) {
    if (!credential) {
        throw new Error('Credential is required to verify the Google token');
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID, // Ensure this is your correct Google client ID
        });

        const payload = ticket.getPayload(); // Returns Google user data

        console.log('Google user payload:', payload);  // Log payload for debugging

        return payload; // This contains user data (id, email, etc.)
    } catch (error) {
        console.error('Error during Google token verification:', error);
        throw new Error('Google token verification failed');
    }
}




// Send verification email
async function sendVerificationEmail(email, verificationCode) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Use Gmail for sending emails
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail address
            pass: process.env.EMAIL_PASS, // Your Gmail app password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Account Verification',
        text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);
}





// Register a new user
async function registerdUser(req, res) {
    try {
        const { email, username, password } = req.body;

        // Check if the email already exists
        const [existingUser] = await sequelize.query(
            'SELECT * FROM "Users" WHERE email = :email',
            {
                replacements: { email },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // Generate a verification code
        const verificationCode = crypto.randomBytes(3).toString('hex'); // 6-character code

        // Hash password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await sequelize.query(
            'INSERT INTO "Users" (email, username, password, "verificationCode", verified) VALUES (:email, :username, :password, :verificationCode, :verified)',
            {
                replacements: {
                    email,
                    username,
                    password: hashedPassword,
                    verificationCode,
                    verified: false, // User not verified initially
                }
            }
        );

        // Send verification email
        await sendVerificationEmail(email, verificationCode);

        res.status(201).json({
            message: "User registered successfully. Please check your email to verify your account."
        });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
}









// Function to verify the email
async function verifyEmail(req, res) {
    try {
        const { email, code } = req.body;

        // Check if the user exists in the database
        const [user] = await sequelize.query(
            'SELECT * FROM "Users" WHERE email = :email',
            {
                replacements: { email },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.verified) {
            return res.status(400).json({ message: "User is already verified" });
        }

        // Check if the verification code matches
        if (user.verificationCode === code) { // Make sure this matches the column name exactly
            // Mark the user as verified
            await sequelize.query(
                'UPDATE "Users" SET verified = true, "verificationCode" = null WHERE email = :email',
                {
                    replacements: { email },
                    type: sequelize.QueryTypes.UPDATE
                }
            );

            return res.json({ message: "Account verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid verification code" });
        }
    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).json({ message: 'Error verifying account', error: error.message });
    }
}


// Login user (email/password or Google login)
async function loginUser(req, res) {
    try {
        const { password, credential, email } = req.body;

        // Handle Google login
        if (credential) {
            try {
                const { sub: providerId, email, name } = await verifyGoogleToken(credential);

                // Check if the user already exists in the database
                const [user] = await sequelize.query(
                    'SELECT * FROM "Users" WHERE "providerId" = :providerId AND "authProvider" = :authProvider',
                    {
                        replacements: { providerId, authProvider: 'google' },
                        type: sequelize.QueryTypes.SELECT
                    }
                );

                if (!user) {
                    // Create new user from Google account
                    await sequelize.query(
                        'INSERT INTO "Users" ("username", "email", "providerId", "authProvider", "password", "verified") VALUES (:name, :email, :providerId, :authProvider, NULL, :verified)',
                        {
                            replacements: {
                                name,
                                email,
                                providerId,
                                authProvider: 'google',
                                verified: true, // Google users are verified by default
                            }
                        }
                    );

                    // Fetch the newly created user
                    const [newUser] = await sequelize.query(
                        'SELECT * FROM "Users" WHERE "providerId" = :providerId AND "authProvider" = :authProvider',
                        {
                            replacements: { providerId, authProvider: 'google' },
                            type: sequelize.QueryTypes.SELECT
                        }
                    );

                    return res.json({
                        message: 'Google login successful',
                        userId: newUser.id,
                        username: newUser.username,
                        email: newUser.email
                    });
                }

                const token = generateToken(user);
                return res.json({
                    message: 'Google login successful',
                    token,
                    userId: user.id,
                    username: user.username,
                    email: user.email
                });
            } catch (error) {
                console.error('Error during Google token verification:', error);
                return res.status(500).json({ message: 'Google login failed', error: error.message });
            }
        }

        // Handle standard login (email and password)
        if (email && password) {
            // Find user by email
            const [user] = await sequelize.query(
                'SELECT * FROM "Users" WHERE email = :email',
                {
                    replacements: { email },
                    type: sequelize.QueryTypes.SELECT
                }
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Ensure users registered with Google cannot use password login
            if (user.authprovider === 'google') {
                return res.status(401).json({ message: 'Please log in using Google' });
            }

            // Compare passwords if it's a regular login
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(403).json({ message: 'Invalid password' });
            }

            const token = generateToken(user);
            return res.json({
                message: 'Login successful',
                token,
                userId: user.id,
                username: user.username,
                email: user.email
            });
        }

        return res.status(400).json({ message: 'Invalid login credentials' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
}


module.exports = { registerdUser, loginUser, verifyEmail };






