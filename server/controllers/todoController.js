const Todo = require('../models/todo');
const { Op } = require('sequelize');

// Function to create a new Todo
async function createTodo(req, res) {
    try {
        const { title, description, userId, isImportant, completedOn } = req.body;

        if (!title || !description || !userId) {
            return res.status(400).json({ message: 'Title, description, and userId are required.' });
        }

        
        const todo = await Todo.create({ 
            title, 
            description, 
            userId, 
            completedOn: completedOn || null, 
            isImportant 
        });

        res.status(201).json({ message: 'Todo created successfully', todo });
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ message: 'Error creating todo', error: error.message });
    }
}



// Function to get all Todos for a specific user
async function getTodos(req, res) {
    try {
        const { userId } = req.params;

        // Validate that userId is provided
        if (!userId) {
            return res.status(400).send({ message: 'UserId is required.' });
        }

        const todos = await Todo.findAll({ where: { userId } });
        res.send(todos);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving todos', error });
    }
}



// Controller to delete a todo item
async function deleteTodo(req, res) {
    const { userId, id } = req.params;

    try {
        const todo = await Todo.findOne({ where: { id , userId } });
        if (!todo) {
            console.log('Todo not found');
            return res.status(404).json({ message: 'Todo not found' });
        }

        await Todo.destroy({ where: { id, userId } });
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting todo', error });
    }
}




async function completeTodo(req, res) {

    try{
        const {userId, id} = req.params
        const {completedOn} = req.body

        if (!userId || !id || !completedOn) {
            return res.status(400).send({ message: 'UserId and TodoId are required.' });
        }

        const todo = await Todo.findOne({where: {userId,  id}})
        
        if (!todo) {
            return res.status(404).send({ message: 'Todo not found.' });
        }

            todo.completedOn = completedOn
            await todo.save()

            res.send({ message: 'Todo marked as completed', todo });
        } catch (error) {
            res.status(500).send({ message: 'Error completing todo', error });
        }
    }


    async function getCompletedTodos(req, res) {
        try {
            const { userId } = req.params;
    
            // Validate that userId is provided
            if (!userId) {
                return res.status(400).send({ message: 'UserId is required.' });
            }
    
            const todos = await Todo.findAll({ where: { userId, completedOn: { [Op.ne]: null } } });
            res.send(todos);
        } catch (error) {
            res.status(500).send({ message: 'Error retrieving completed todos', error });
        }
    }


    // Function to update a todo
async function updateTodo(req, res) {
    const { userId, id } = req.params;
    const { title, description } = req.body;

    try {
        const todo = await Todo.findOne({ where: { id, userId } });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        todo.title = title;
        todo.description = description;
        await todo.save();

        res.json({ message: 'Todo updated successfully', todo });
    } catch (error) {
        res.status(500).json({ message: 'Error updating todo', error: error.message });
    }
}


const toggleTaskStatus = async (req, res) => {
    try {
      const { taskId } = req.params;
      const task = await Todo.findByPk(taskId);
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Toggle the completedOn status
      if (task.completedOn) {
        // Mark as incomplete
        task.completedOn = null;
      } else {
        // Mark as complete, and convert the date to a string
        task.completedOn = new Date().toISOString();
      }
  
      await task.save();
      res.json(task);
    } catch (error) {
      console.error('Error toggling task status:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };
  

    module.exports = { createTodo, getTodos, deleteTodo, completeTodo, getCompletedTodos, updateTodo, toggleTaskStatus };
