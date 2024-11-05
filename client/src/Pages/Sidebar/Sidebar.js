// // Sidebar.js
// import React from 'react';
// import './Sidebar.css';

// function Sidebar({ setFilter }) { // Accept setFilter as a prop
//   return (
//     <div className="sidebar">
//       <div className="profile">
//         <img
//           src="https://via.placeholder.com/100"
//           alt="Profile"
//           className="profile-img"
//         />
//         <h3>Maclinz Maclinz</h3>
//       </div>
//       <nav className="nav">
//         <ul>
//           <li onClick={() => setFilter('all')}>All Tasks</li>
//           <li onClick={() => setFilter('important')}>Important</li>
//           <li onClick={() => setFilter('completed')}>Completed</li>
//         </ul>
//       </nav>
//       <button className="sign-out">Sign Out</button>
//     </div>
//   );
// }

// export default Sidebar;
















import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { FaSignOutAlt } from "react-icons/fa";

import './Sidebar.css';
import { UserContext } from '../Context/UserContext';
import { MdDarkMode, MdLightMode } from 'react-icons/md'; // Import both icons


function Sidebar({ setFilter }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { isDarkMode, toggleTheme } = useContext(UserContext);
  const { user, setUser } = useContext(UserContext); // Assuming setUser is also provided
  const navigate = useNavigate();

  const username = user?.username;

  console.log("username", username);




  const handleFilterClick = (filter) => {
    setFilter(filter);
    setSelectedFilter(filter);
  };


  const handleSignOut = () => {
    // Clear user session
    setUser(null); // Set user state to null or initial state
    localStorage.removeItem('user'); // Optionally remove token from localStorage if stored
    navigate('/'); // Redirect to the login page
  };

  return (
    <div className={`sidebar ${isDarkMode ? 'dark' : ''}`}>
      <div className="profile">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="profile-img"
        />
        <h3 className='profile-name'> Welcome, {username}</h3>
      </div>
      <nav className="nav">
        <ul>
          <li
            className={selectedFilter === 'all' ? 'active' : ''}
            onClick={() => handleFilterClick('all')}
          >
            <i className="icon-home"></i> All Tasks
          </li>
          <li
            className={selectedFilter === 'important' ? 'active' : ''}
            onClick={() => handleFilterClick('important')}
          >
            <i className="icon-important"></i> Important!
          </li>
          <li
            className={selectedFilter === 'completed' ? 'active' : ''}
            onClick={() => handleFilterClick('completed')}
          >
            <i className="icon-completed"></i> Completed!
          </li>

        </ul>
      </nav>

    

      <div className="sign-out-container" onClick={handleSignOut}>
        <FaSignOutAlt className='sign-out-icon'/>
        <button className="sign-out" >Sign Out</button>

      </div>
    </div>
  );
}

export default Sidebar;
