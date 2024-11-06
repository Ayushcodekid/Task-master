// import React, { useContext } from 'react';
// import api from '../../api';
// import { UserContext } from '../Context/UserContext'; // Fetch userId from context
// import './Taskcard.css';

// function TaskCard({ task }) {
//   const { user } = useContext(UserContext);
//   const userId = user?.userId;

//   const handleDelete = async () => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this task?");

//     if (confirmDelete) {
//       try {
//         await api.delete(`/todos/${userId}/${task.id}`);
//         alert("Task deleted successfully!");
//         // Here you might want to trigger a state update to remove the task from view
//       } catch (error) {
//         console.error('Error deleting task:', error);
//         alert("Error deleting task. Please try again.");
//       }
//     }
//   };




//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString(); // This will return date in 'MM/DD/YYYY' format by default
//   };


//   return (
//     <div className={`task-card ${task.completedOn ? 'completed' : 'incomplete'}`}>
//       <h3>{task.title}</h3>
//       <p>{task.description}</p>
//       <div className="task-footer">
//       <span className="task-date">{formatDate(task.completedOn)}</span> {/* Display the formatted date */}
//       <div className="task-actions">
//           <button className="edit-btn">🖉</button>
//           <button className="delete-btn" onClick={handleDelete}>🗑</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TaskCard;











import React, { useContext, useState, useEffect } from 'react';
import { AiFillDelete } from "react-icons/ai";
import { MdEditDocument } from "react-icons/md";
import { RiLoaderFill } from "react-icons/ri";
import LoadingScreen from '../Loader/Loading';
import toast, { Toaster } from 'react-hot-toast';



import api from '../../api';
import { UserContext } from '../Context/UserContext';
import './Taskcard.css';



function TaskCard({ task, onUpdateStatus, onDelete }) {
  const { user } = useContext(UserContext);
  const userId = user?.userId;
  const { isDarkMode, toggleTheme } = useContext(UserContext);
  const [loading, setLoading] = useState(false);


  const [isCompleted, setIsCompleted] = useState(!!task.completedOn); // Initialize state based on completedOn

  const [tasks, setTasks] = useState([]);

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



  // const handleDelete = async () => {
  //   const confirmDelete = window.confirm("Are you sure you want to delete this task?");

  //   if (confirmDelete) {
  //     try {
  //       setLoading(true);
  //       await api.delete(`/todos/${userId}/${task.id}`);

  //       // alert("Task deleted successfully!");
  //       setTasks((prevTasks) => prevTasks.filter(t => t.id !== task.id)); // This assumes `tasks` is part of your component state.
  //       onDelete(task.id);
  //       setLoading(false);


  //       // Here you might want to trigger a state update to remove the task from view
  //     } catch (error) {
  //       console.error('Error deleting task:', error);
  //       alert("Error deleting task. Please try again.");
  //     }
  //   }
  // };







  const handleDelete = async () => {
    const confirmDelete = toast(
      (t) => (
        <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          Are you sure you want to delete this task?
          <button
            onClick={() => confirmAction(t)}
            style={{ marginLeft: '8px', color: 'red', cursor: 'pointer'  }}
          >
            Yes
          </button>
          <button onClick={() => toast.dismiss(t.id)} style={{ marginLeft: '8px', cursor: 'pointer' }}>
            No
          </button>
        </span>
      ),
      { duration: 5000 ,
        style: {
          background: 'white', // light red background for warning
          color: '#721c24',       // dark red text
          border: '1px solid #f5c6cb', // red border
        },
      }
    );
    const confirmAction = async (t) => {
      toast.dismiss(t.id);
      toast.loading("Deleting task...");

      try {
        setLoading(true);
        await api.delete(`/todos/${task.userId}/${task.id}`);
        onDelete(task.id); // update parent component state
        toast.dismiss(); // clear the loading toast
        toast.success("Task deleted successfully!");
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.dismiss(); // clear the loading toast
        toast.error("Error deleting task. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  };




  const handleStatusToggle = async () => {
    try {
      setLoading(true);
      toast.loading("Updating task status..."); // Show loading toast

      const updatedStatus = !isCompleted;
      await api.patch(`/${task.id}/toggle-status`, { completedOn: updatedStatus ? new Date() : null });
      setIsCompleted(updatedStatus); // Update local state to reflect change
      setLoading(false);
      toast.dismiss();
      toast.success(`Task set to ${updatedStatus ? "Completed" : "Incomplete"}`);
      onUpdateStatus(task.id, updatedStatus);

    } catch (error) {
      console.error('Error updating task status:', error);
      alert("Error updating task status. Please try again.");
    }
  };





  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // This will return date in 'MM/DD/YYYY' format by default
  };

  return (
    <div className={`task-card ${isCompleted ? 'completed' : 'incomplete'}`}>

      {loading && (
        <LoadingScreen />
      )}

      <Toaster position="top-center" />
      <div className="task-footer">

        <div className='title-des'>

          <h2>{task.title}</h2>
          <p>{task.description}</p>
        </div>
      </div><br></br>

      <div className='date'>
        <span className="task-date">{formatDate(task.completedOn)}</span>
      </div>



      <div className="task-actions">
        <button
          className={`status-toggle-btn ${isCompleted ? 'completed-btn' : 'incomplete-btn'}`}
          onClick={handleStatusToggle}
        >
          {isCompleted ? 'Completed' : 'Incomplete'}
        </button>

        <div className='card-buttons'>
          <button className="edit-btn">
            <MdEditDocument />
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            <AiFillDelete />
          </button>
        </div>
      </div>

    </div>
  );
}

export default TaskCard;
