// const express = require('express');
// const cors = require('cors'); // Import cors
// const sequelize = require('./db');
// const authRoutes = require('./routes/authRoutes'); // Correct import for routes
// require('dotenv').config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Register the routes
// app.use('/api', authRoutes); // Use '/api' as the base path

// // Sync the database and start the server
// sequelize.sync({ force: false })
//     .then(() => {
//         app.listen(process.env.PORT || 5000, () => {
//             console.log(`Server is running on port ${process.env.PORT || 5000}`);
//         });
//     })
//     .catch(err => console.error('Unable to connect to the database:', err));











const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Register the routes
app.use('/api', authRoutes); // Use '/api' as the base path

// Sync the database and start the server
sequelize.sync({ alter: true }) // Set `alter: true` to automatically update tables if there are any changes in models
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        process.exit(1); // Exit process with failure code
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
