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
















import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar({ setFilter }) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleFilterClick = (filter) => {
    setFilter(filter);
    setSelectedFilter(filter);
  };

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
      <button className="sign-out">Sign Out</button>
    </div>
  );
}

export default Sidebar;
