


const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcryptjs');


const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: "Must be a valid email address"
      }
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Password can be null for Google users
  },
  providerId: {
    type: DataTypes.STRING,
    allowNull: true, // providerId can be null for regular users
    unique: true,
  },
  authProvider: {
    type: DataTypes.STRING,
    allowNull: true, // authProvider can be null for regular users
  },
  verificationCode: {
    type: DataTypes.STRING, // Corrected to DataTypes.STRING
  },

  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Ensures a default false value for verified
  },
  
}, {
  timestamps: false, // Adds `createdAt` and `updatedAt` fields
  hooks: {
    beforeSave: async (user) => {
      // Check if the user is registering via Google
      if (user.authProvider === 'google') {
        // If Google user, password should be null
        user.password = null; // Don't hash or store a password for Google users
        // Ensure providerId is also set for Google users
        if (!user.providerId) {
          throw new Error('ProviderId is required for Google users');
        }
      } else {
        // If it's a regular registration (email/password), handle password hashing
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
        // If no providerId and authProvider provided, don't set them
        user.providerId = null;
        user.authProvider = null;
      }
    },
  },
});

module.exports = User;

