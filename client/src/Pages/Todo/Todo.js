import React, { useState, useEffect, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import api from '../../api';
import Sidebar from '../Sidebar/Sidebar';
import TaskCard from '../Taskcard/Taskcard';
import { UserContext } from '../Context/UserContext'; 
import './Todo.css';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const { user } = useContext(UserContext); 
  const userId = user?.userId;

  // State for new task form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isCompleted, setCompleted] = useState(false);
  const [isImportant, setImportant] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false); // Track submission status

  // Fetch tasks when the component loads
  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await api.get(`/todos/${userId}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  // Handle adding new task
  const handleAddTask = async () => {
    const newTask = {
      title,
      description,
      date,
      status: isCompleted ? 'Completed' : 'Incomplete',
      isImportant,
      completedOn: isCompleted ? new Date().toISOString() : null, // Set completedOn if the task is marked completed
      userId, // Fetched from context
    };

    if (isSubmitting) {
      console.log('Submission in progress, ignoring further submissions.'); // Log if already submitting
      return;
    }

    setSubmitting(true); // Set submitting to true

    try {
      const response = await api.post('/todos', newTask);
      console.log('Task created successfully:', response.data.todo); // Log success response
      setTasks([...tasks, response.data.todo]); // Update the tasks list
      // Reset form fields
      setTitle('');
      setDescription('');
      setDate('');
      setCompleted(false);
      setImportant(false);
      setModalOpen(false); // Close modal
    } catch (error) {
      console.error('Error creating task:', error.response?.data || error.message);
    } finally {
      setSubmitting(false); // Reset submitting status
    }
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'important') return task.isImportant;
    if (filter === 'completed') return task.completedOn !== null; // Assuming completedOn is set when a task is completed
    return true; // For 'all', return all tasks
  });

  return (
    <div className="app">
      <Sidebar setFilter={setFilter} />
      <div className="tasks-container">
        <h2>{filter.charAt(0).toUpperCase() + filter.slice(1)} Tasks</h2>
        <div className="task-cards-container">
          {filteredTasks.map((task, index) => (
            <TaskCard key={index} task={task} />
          ))}
          {/* Add New Task Card */}
          <div
            className="add-task-card"
            onClick={() => setModalOpen(true)} // Open modal
          >
            <h3>+ Add New Task</h3>
          </div>
        </div>
      </div>

      {/* AddTaskModal */}
      <Dialog
        className='modal-box'
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: '#2e2e3f',
            width: '28%',
            borderRadius: '15px',
          },
        }}
      >
        <DialogTitle style={{ backgroundColor: '#2e2e3f', color: '#fff', fontWeight: 'bold', fontSize: '24px' }}>
          Create a Task
        </DialogTitle>

        <DialogContent style={{ backgroundColor: '#2e2e3f' }}>
          <h2 style={{ color: 'white' }}>Title</h2>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            InputProps={{
              style: { color: '#fff', backgroundColor: 'rgb(27, 26, 26)' },
            }}
            InputLabelProps={{
              style: { color: '#aaa' },
            }}
            style={{ marginBottom: '20px' }}
          />
          <h2 style={{ color: 'white' }}>Description</h2>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            required
            InputProps={{
              style: { color: '#fff', backgroundColor: 'rgb(27, 26, 26)' },
            }}
            InputLabelProps={{
              style: { color: '#aaa' },
            }}
            style={{ marginBottom: '20px' }}
          />
          <TextField
            label="Date"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true, style: { color: '#aaa' } }}
            InputProps={{
              style: { color: '#fff' },
            }}
            style={{ marginBottom: '20px' }}
          />
          <div className='checkbox'>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCompleted}
                    onChange={(e) => setCompleted(e.target.checked)}
                    style={{ color: '#fff' }}
                  />
                }
                label={<span style={{ color: '#fff' }}>Toggle Completed</span>}
                labelPlacement="start"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isImportant}
                    onChange={(e) => setImportant(e.target.checked)}
                    style={{ color: '#fff' }}
                  />
                }
                label={<span style={{ color: '#fff' }}>Toggle Important</span>}
                labelPlacement="start"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions style={{ backgroundColor: '#2e2e3f' }}>
          <Button onClick={() => setModalOpen(false)} style={{ color: '#fff', backgroundColor: '#ff5252' }}>
            Close
          </Button>
          <Button 
            onClick={handleAddTask} 
            style={{ color: '#fff', backgroundColor: '#008cba' }} 
            disabled={isSubmitting} // Disable button if submitting
          >
            + Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TodoList;
