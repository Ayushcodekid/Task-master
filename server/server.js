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
const sequelize = require('./db'); // Your Sequelize instance
const authRoutes = require('./routes/authRoutes');
const syncTables = require('./Tables/tables'); // Import the table creation logic
require('dotenv').config();
const { Server } = require('socket.io');
const http = require('http'); // For WebSocket server

const app = express();


// Create an HTTP server and integrate with Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST'],
    credentials: true,
  },
});


app.use(cors({
  origin: '*',
  credentials: true,
}));

// COOP and COEP headers setup
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none'); // Or 'require-corp'
  next();
});





app.use(express.json());

// Register the routes
app.use('/api', authRoutes); // Use '/api' as the base path











io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinProject', ({ projectId }) => {
    console.log(`User joined project: ${projectId}`);
    socket.join(projectId);
  });

  socket.on('sendMessage', (data) => {
    console.log('Message received:', data);
    io.to(data.projectId).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});





// Sync the database using raw SQL and start the server
(async function startServer() {
  try {
    await sequelize.authenticate(); // Ensure the connection to the database is valid
    console.log('Database connection established.');

    // Run the table creation logic
    await syncTables(); // Execute the syncTables function from tables.js
    console.log('All tables have been created or updated using raw SQL.');

    // Start the Express server
    const PORT = process.env.PORT || 9000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting the server:', err);
    process.exit(1); // Exit process with failure code
  }
})();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
