const sequelize = require('../db');

// Create Users table
const createUsersTable = `
CREATE TABLE IF NOT EXISTS "Users" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  providerId VARCHAR(255),
  authProvider VARCHAR(255),
  verificationCode VARCHAR(255),
  verified BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;


// Create Tasks table
const createTodoTable = `
CREATE TABLE IF NOT EXISTS "Todos" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  completedOn VARCHAR(255),
  isImportant BOOLEAN DEFAULT FALSE,
  userId UUID NOT NULL REFERENCES "Users"(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// Create Projects table
const createProjectsTable = `
CREATE TABLE IF NOT EXISTS "projects" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  createdBy UUID NOT NULL REFERENCES "Users"(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// Create ProjectUsers table
const createProjectUsersTable = `
CREATE TABLE IF NOT EXISTS "projectusers" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  projectId UUID NOT NULL REFERENCES "projects"(id),
  userId UUID NOT NULL REFERENCES "Users"(id),
  role VARCHAR(50) DEFAULT 'member',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// Create ChatMessages table
const createChatMessagesTable = `
CREATE TABLE IF NOT EXISTS ChatMessages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  projectId UUID NOT NULL REFERENCES "projects"(id),
  senderEmail VARCHAR(255) NOT NULL REFERENCES "Users"(email),
  projectName VARCHAR(255) NOT NULL REFERENCES "projects"(name),
  message TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// Sync all tables
async function syncTables() {
  try {
    await sequelize.query(createUsersTable);
    await sequelize.query(createTodoTable); // Include Todo table
    await sequelize.query(createProjectsTable);
    await sequelize.query(createProjectUsersTable);
    await sequelize.query(createChatMessagesTable);
    console.log('All tables have been created!');
  } catch (err) {
    console.error('Error syncing tables:', err);
  }
}

module.exports = syncTables;
