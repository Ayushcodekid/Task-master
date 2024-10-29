// Sidebar.js
import React from 'react';
import './Sidebar.css';

function Sidebar({ setFilter }) { // Accept setFilter as a prop
  return (
    <div className="sidebar">
      <div className="profile">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="profile-img"
        />
        <h3>Maclinz Maclinz</h3>
      </div>
      <nav className="nav">
        <ul>
          <li onClick={() => setFilter('all')}>All Tasks</li>
          <li onClick={() => setFilter('important')}>Important</li>
          <li onClick={() => setFilter('completed')}>Completed</li>
        </ul>
      </nav>
      <button className="sign-out">Sign Out</button>
    </div>
  );
}

export default Sidebar;
