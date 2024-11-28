const sequelize = require('../db'); // Import Sequelize instance
const { v4: uuidv4 } = require('uuid'); // To generate UUIDs

// Create a new project
async function createProject(req, res) {
    console.log('Received request body:', req.body);  // Log the body to check

    const { name, description, createdBy } = req.body;

    // Check if createdBy is undefined here
    if (!createdBy) {
        return res.status(400).json({ message: "Creator's email (createdBy) is required." });
    }

    console.log("Received data for project creation:", { name, description, createdBy });

    try {
        // Fetch the user ID based on the email of the creator
        const [user] = await sequelize.query(
            'SELECT id FROM "Users" WHERE email = :ownerEmail',
            {
                replacements: { ownerEmail: createdBy },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User with the provided email does not exist." });
        }

        const userId = user.id;

        // Insert the project into the "projects" table
        const [result] = await sequelize.query(
            `INSERT INTO "projects" (name, description, createdby)
             VALUES (:name, :description, :createdBy)
             RETURNING *`,
            {
                replacements: {
                    name,
                    description,
                    createdBy: userId,
                },
                type: sequelize.QueryTypes.INSERT,
            }
        );

        res.status(201).json({
            message: "Project created successfully.",
            project: result,
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: "Error creating project", error: error.message });
    }
}




// Add a user to a project by email
async function addUserToProject(req, res) {
    try {
        const { projectId, userEmail } = req.body;

        // Validate the project exists
        const [project] = await sequelize.query(
            'SELECT id FROM "projects" WHERE id = :projectId',
            {
                replacements: { projectId },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Find the user by email
        const [user] = await sequelize.query(
            'SELECT id, email FROM "Users" WHERE email = :userEmail',
            {
                replacements: { userEmail },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is already part of the project
        const [existingRelation] = await sequelize.query(
            'SELECT * FROM "projectusers" WHERE "userid" = :userId AND "projectid" = :projectId',
            {
                replacements: { userId: user.id, projectId },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (existingRelation) {
            return res.status(400).json({ message: 'User is already part of the project' });
        }

        // Link the user to the project and store the email of the added user
        await sequelize.query(
            'INSERT INTO "projectusers" ("userid", "projectid", "email") VALUES (:userId, :projectId, :userEmail)', // Add useremail here
            {
                replacements: { userId: user.id, projectId, userEmail: user.email }, // Pass email as well
            }
        );

        res.status(200).json({ message: 'User added to project successfully' });
    } catch (error) {
        console.error('Error adding user to project:', error);
        res.status(500).json({ message: 'Error adding user to project', error: error.message });
    }
}








async function getProjectsByUser(req, res) {
    try {
        const { userId } = req.params;

        // Debug: Log the userId received
        console.log('User ID received:', userId);

        // Fetch projects created by the user (creator projects)
        const creatorProjects = await sequelize.query(
            `
            SELECT DISTINCT p.* 
            FROM "projects" p
            WHERE p.createdby = :userId
            `,
            {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        // Debug: Check if creator projects were returned
        console.log('Creator Projects:', creatorProjects);

        // Fetch projects where the user is added as a participant
        const participantProjects = await sequelize.query(
            `
            SELECT DISTINCT p.* 
            FROM "projects" p
            LEFT JOIN "projectusers" pu ON p.id = pu.projectId
            WHERE pu.userid = :userId
            AND p.createdby != :userId
            `,
            {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        // Debug: Check if participant projects were returned
        console.log('Participant Projects:', participantProjects);

        // Combine both arrays and remove duplicates using a Map
        const allProjects = [...creatorProjects, ...participantProjects];
        const projectsMap = new Map();
        allProjects.forEach(project => {
            projectsMap.set(project.id, project);  // Ensures uniqueness by project.id
        });

        const uniqueProjects = Array.from(projectsMap.values());

        // Debug: Log the combined unique projects
        console.log('Unique Projects found:', uniqueProjects);

        if (uniqueProjects.length === 0) {
            return res.status(404).json({ message: "No projects found for this user." });
        }

        // Send the response with both creator and participant projects separately
        res.status(200).json({
            creatorProjects: creatorProjects,   // Projects created by the user
            participantProjects: participantProjects, // Projects the user is added to
        });
    } catch (error) {
        console.error('Error fetching user projects:', error);
        res.status(500).json({ message: 'Error fetching user projects', error: error.message });
    }
}





// Fetch a specific project by its ID, along with its users
async function getProject(req, res) {
    try {
        const { projectId } = req.params; // Project ID from the request parameters
        console.log(`Received request to fetch project with ID: ${projectId}`);

        // Fetch project details
        const [project] = await sequelize.query(
            'SELECT * FROM "projects" WHERE id = :projectId',
            {
                replacements: { projectId },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        console.log('Project query result:', project);

        if (!project) {
            console.log(`Project with ID ${projectId} not found`);
            return res.status(404).json({ message: 'Project not found' });
        }

        // Fetch users assigned to the project
        const users = await sequelize.query(
            'SELECT u.id, u.email, u.username, pu.role FROM "Users" u ' +
            'JOIN "projectusers" pu ON u.id = pu.userId WHERE pu.projectId = :projectId',
            {
                replacements: { projectId },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        console.log('Users assigned to the project:', users);

        // Return project details and the list of users assigned to the project
        res.status(200).json({
            project,
            users,
        });
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).json({ message: 'Error fetching project details', error: error.message });
    }
}






module.exports = { createProject, addUserToProject, getProjectsByUser, getProject };



