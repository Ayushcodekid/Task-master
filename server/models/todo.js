const { DataTypes } = require('sequelize');
const sequelize = require("../db");

const Todo = sequelize.define('Todo', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    completedOn: {
        type: DataTypes.STRING,
    },
    isImportant: { // New field for importance
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Default value
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users', // Ensure this matches the name of your User model
            key: 'id',
        },
    },
}, {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
});

module.exports = Todo;
