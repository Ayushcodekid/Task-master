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











import React, { useContext, useState } from 'react';
import api from '../../api';
import { UserContext } from '../Context/UserContext'; // Fetch userId from context
import './Taskcard.css';

function TaskCard({ task }) {
  const { user } = useContext(UserContext);
  const userId = user?.userId;

  const [isCompleted, setIsCompleted] = useState(!!task.completedOn); // Initialize state based on completedOn

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");

    if (confirmDelete) {
      try {
        await api.delete(`/todos/${userId}/${task.id}`);
        alert("Task deleted successfully!");
        // Here you might want to trigger a state update to remove the task from view
      } catch (error) {
        console.error('Error deleting task:', error);
        alert("Error deleting task. Please try again.");
      }
    }
  };

  const handleStatusToggle = async () => {
    try {
      const updatedStatus = !isCompleted;
      await api.patch(`/${task.id}/toggle-status`, { completedOn: updatedStatus ? new Date() : null });
      setIsCompleted(updatedStatus); // Update local state to reflect change
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
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-footer">
        <span className="task-date">{formatDate(task.completedOn)}</span>
        <div className="task-actions">
          <button
            className={`status-toggle-btn ${isCompleted ? 'completed-btn' : 'incomplete-btn'}`}
            onClick={handleStatusToggle}
          >
            {isCompleted ? 'Completed' : 'Incomplete'}
          </button>
          <button className="edit-btn">🖉</button>
          <button className="delete-btn" onClick={handleDelete}>🗑</button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
