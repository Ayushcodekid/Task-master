const express = require('express');
const router = express.Router();
const sequelize = require('../db');

// Get messages for a specific project
async function getChatMessages(req, res) {
    const { projectId } = req.params;

    if (!projectId) {
        return res.status(400).json({ message: 'Project ID is required.' });
    }

    console.log('Received projectId:', projectId);

    try {
        const messages = await sequelize.query(
            `SELECT * FROM "chatmessages" WHERE "projectid" = :projectId ORDER BY "createdat" ASC`,
            { replacements: { projectId }, type: sequelize.QueryTypes.SELECT }
        );

        console.log("Messages from DB:", messages); // Add this line to debug

        // Return 404 if no messages found
        if (!messages || messages.length === 0) {
            return res.status(404).json({ message: 'No messages found for this project.' });
        }

        console.log("Messages found:", messages);

        res.status(200).json({ data: messages });

    } catch (err) {
        console.error('Error fetching chat messages:', err);
        res.status(500).send('Failed to fetch messages.');
    }
}



// Add a new message to a project
async function sendMessage(req, res) {
    const { projectId, senderEmail, message } = req.body; // Read from request body

    try {
        // Fetch the projectName based on the projectId
        const [project] = await sequelize.query(
            `SELECT "name" FROM "projects" WHERE "id" = :projectId`,
            { replacements: { projectId }, type: sequelize.QueryTypes.SELECT }
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        const projectName = project.name;

        // Insert the new message with the projectName
        await sequelize.query(
            `INSERT INTO "chatmessages" ("projectid", "senderemail", "message", "projectname") VALUES (:projectId, :senderEmail, :message, :projectName)`,
            { replacements: { projectId, senderEmail, message, projectName } }
        );

        console.log('Message for project:', message);

        res.status(201).send('Message added successfully.');
    } catch (err) {
        console.error('Error adding chat message:', err);
        res.status(500).send('Failed to add message.');
    }
}


module.exports = { getChatMessages, sendMessage };
