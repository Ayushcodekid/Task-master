import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import api from '../../api';
import { UserContext } from '../Context/UserContext';
import { MdDarkMode, MdLightMode } from 'react-icons/md'; // Import both icons
import { RiLoaderFill } from "react-icons/ri";
import LoadingScreen from '../Loader/Loading';
import toast, { Toaster } from 'react-hot-toast';
import { FaSignOutAlt, FaBars } from 'react-icons/fa'; // Hamburger icon for mobile view



import Sidebar from '../Sidebar/Sidebar';
import TaskCard from '../Taskcard/Taskcard';
import './Todo.css';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const { isDarkMode, toggleTheme } = useContext(UserContext);

  const userId = user?.userId;

  // State for new task form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isCompleted, setCompleted] = useState(false);
  const [isImportant, setImportant] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false); // Track submission status
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar open/close


  // Fetch tasks when the component loads
  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        const response = await api.get(`/todos/${userId}`);
        setTasks(response.data);
        setLoading(false);

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
      date: date ? new Date(date).toISOString() : null, // Convert date to ISO string
      status: isCompleted ? 'Completed' : 'Incomplete',
      isImportant,
      completedOn: isCompleted ? new Date().toISOString() : new Date().toISOString(), // Take today's date regardless
      userId, // Fetched from context
    };

    if (isSubmitting) {
      console.log('Submission in progress, ignoring further submissions.'); // Log if already submitting
      return;
    }

    setSubmitting(true); // Set submitting to true
    setModalOpen(false);

    try {
      setLoading(true);
      toast.loading('Creating task...'); // Show loading toast


      const response = await api.post('/todos', newTask);
      console.log('Task created successfully:', response.data.todo); // Log success response

      setTasks([...tasks, response.data.todo]); // Update the tasks list

      setTitle('');
      setDescription('');
      setDate('');
      setCompleted(false);
      setImportant(false);
      toast.dismiss(); // Clear the loading toast
      toast.success('Task created successfully!'); // Success notification

      setLoading(false);
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



  // Function to update task status
  const updateTaskStatus = (taskId, isCompleted) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completedOn: isCompleted ? new Date() : null } : task
      )
    );
  };



  const handleUpdate = (taskId, newTitle, newDescription) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, title: newTitle, description: newDescription } : task
      )
    );
  };


  // Function to remove task from the list
  const onDeleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };




  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar visibility
  };




  return (
    <div className={`app ${isDarkMode ? 'dark' : ''} ${isModalOpen ? 'blur' : ''} `}>

      <Sidebar setFilter={setFilter} isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="tasks-container">

        <div className="sidebar-toggle" onClick={toggleSidebar}>
          <FaBars className="sidebar-toggle-icon" />
        </div>

        <div className="tasks-header">
          <h2 className='section-title'>{filter.charAt(0).toUpperCase() + filter.slice(1)} Tasks</h2>
          <div onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {isDarkMode ? <MdLightMode className='light-mode-icon' style={{ color: 'black' }} /> : <MdDarkMode className='dark-mode-icon' style={{ color: 'white' }} />}
          </div>
        </div>

        {loading && (

          <LoadingScreen />
        )}

        <div className="task-cards-container">
          {filteredTasks.map((task, index) => (
            <TaskCard key={index} task={task} onUpdateStatus={updateTaskStatus} onDelete={onDeleteTask} onUpdate={handleUpdate}/>
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

  <div className='modal-container'>
      <Dialog
        className='modal-box'
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: isDarkMode ? '#fff' : '#1f1e1e',
            marginLeft: '10%',
            // width: '28%',
            borderRadius: '15px',
          },
        }}

        maxWidth="xs"  
        fullWidth={true}
      >
        <DialogTitle style={{ backgroundColor: isDarkMode ? '#fff' : '#1f1e1e', color: isDarkMode ? 'black' : 'white', fontWeight: 'bold', fontSize: '24px', textAlign: 'center' }}>
          Create a Task
        </DialogTitle>

        <DialogContent style={{ backgroundColor: isDarkMode ? '#fff' : '#1f1e1e', scrollbarWidth: 'none', background: 'transparent', marginTop: '-5%' }}>
          <h2 style={{ color: isDarkMode ? 'black' : 'white' }}>Title</h2>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            InputProps={{
              style: { color: '#fff', backgroundColor: isDarkMode ? '#fff' : 'rgb(27, 26, 26)', borderColor: 'black' },
            }}
            InputLabelProps={{
              style: { color: isDarkMode ? 'black' : '#aaa' },
            }}
            style={{ marginBottom: '20px' }}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' } } }}
          />



          <h2 style={{ color: isDarkMode ? 'black' : 'white' }}>Description</h2>
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
              style: { color: '#fff', backgroundColor: isDarkMode ? '#fff' : 'rgb(27, 26, 26)', borderColor: 'black' },
            }}
            InputLabelProps={{
              style: { color: isDarkMode ? 'black' : '#aaa' },
            }}
            style={{ marginBottom: '20px' }}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' } } }}
          />


          <TextField
            label="Date"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true, style: { color: isDarkMode ? 'black' : '#aaa' } }}
            InputProps={{
              style: { color: isDarkMode ? 'black' : '#fff', backgroundColor: isDarkMode ? '#fff' : 'rgb(27, 26, 26)', borderColor: 'black' },
            }}
            style={{ marginBottom: '20px' }}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' } } }}
          />

          <div className='checkbox'>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCompleted}
                    onChange={(e) => setCompleted(e.target.checked)}
                    style={{ color: isDarkMode ? 'black' : '#fff' }}
                  />
                }
                label={<span style={{ color: isDarkMode ? 'black' : '#fff' }}>Toggle Completed</span>}
                labelPlacement="start"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isImportant}
                    onChange={(e) => setImportant(e.target.checked)}
                    style={{ color: isDarkMode ? 'black' : '#fff' }}
                  />
                }
                label={<span style={{ color: isDarkMode ? 'black' : '#fff' }}>Toggle Important</span>}
                labelPlacement="start"
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions style={{ backgroundColor: isDarkMode ? '#fff' : '#1f1e1e', }}>
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
    </div>
  );
}

export default TodoList;
