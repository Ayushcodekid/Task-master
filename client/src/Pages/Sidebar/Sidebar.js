

// import React, { useContext, useState, useEffect, useRef } from 'react';
// import { UserContext } from '../Context/UserContext';
// import api from '../../api';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import { FaSignOutAlt } from 'react-icons/fa';
// import { Modal, Button, TextField, CircularProgress, Collapse, List, ListItem, ListItemText } from '@mui/material';
// import { KeyboardArrowDown } from '@mui/icons-material'; // Import KeyboardArrowDown icon
// import { IoMdArrowRoundBack } from 'react-icons/io';
// import { MdOutlineGroupAdd } from "react-icons/md";
// import LoadingScreen from '../Loader/Loading';
// import { MdOutlinePersonAddAlt } from "react-icons/md";


// import './Sidebar.css';

// function Sidebar({ setFilter, isOpen, setIsSidebarOpen }) {
//   const [selectedFilter, setSelectedFilter] = useState('all');
//   const [projects, setProjects] = useState([]);
//   const [newProject, setNewProject] = useState({ name: '', description: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [openModal, setOpenModal] = useState(false);
//   const [openAddUserModal, setOpenAddUserModal] = useState(false);
//   const [selectedProject, setSelectedProject] = useState('');
//   const [showProjects, setShowProjects] = useState(false);
//   const [emailToAdd, setEmailToAdd] = useState(''); // Email input state for adding users
//   const { user, setUser, isDarkMode, projectId, selectProject } = useContext(UserContext); // Access user, dark mode, and projectId from context
//   const sidebarRef = useRef(null);
//   const navigate = useNavigate();

//   const username = user?.username;
//   const userId = user?.userId;
//   const email = user?.email;

//   // Fetch projects on load
//   useEffect(() => {
//     if (userId) {
//       fetchProjects();
//     } else {
//       navigate('/todo');
//     }
//   }, [userId, navigate]);

//   const fetchProjects = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get(`/projects/user/${userId}`);
//       setProjects(response.data.projects);
//     } catch (err) {
//       setError('Failed to fetch projects. Please try again.');
//       toast.error('Error fetching projects.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateProject = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await api.post('/createproject', {
//         ...newProject,
//         createdBy: email,
//       });
//       toast.success('Project created successfully.');
//       setNewProject({ name: '', description: '' });
//       fetchProjects();
//       setOpenModal(false);
//     } catch (err) {
//       setError('Failed to create project. Please try again.');
//       toast.error('Error creating project.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddUserToProject = async () => {
//     if (!emailToAdd) {
//       toast.error('Please enter an email.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await api.post('/projects/add-user', {
//         projectId: projectId, // Pass the selected project ID
//         userEmail: emailToAdd, // Pass the email of the user to be added
//       });

//       toast.success('User added to the project!');
//       setEmailToAdd(''); // Reset email field
//       setOpenAddUserModal(false); // Close the modal
//     } catch (err) {
//       toast.error('Error adding user. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterClick = (filter) => {
//     setFilter(filter);
//     setSelectedFilter(filter);
//   };

//   const handleSignOut = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//     navigate('/');
//   };



//   const handleProjectSelection = (projectId) => {
//     // Update the context and local storage
//     selectProject(projectId);
//     localStorage.setItem('selectedProjectId', projectId);
//   };

//   return (
//     <div ref={sidebarRef} className={`sidebar ${isDarkMode ? 'dark' : ''} ${isOpen ? 'open' : 'closed'}`}>
//       <IoMdArrowRoundBack className="back-btn" onClick={() => setIsSidebarOpen(false)} />
//       <div className="profile">
//         <img src="https://via.placeholder.com/100" alt="Profile" className="profile-img" />
//         <h3 className="profile-name">Welcome, {username}</h3>
//       </div>

//       <nav className="nav">
//         <ul>
//           <li className={selectedFilter === 'all' ? 'active' : ''} onClick={() => handleFilterClick('all')}>
//             All Tasks
//           </li>
//           <li className={selectedFilter === 'important' ? 'active' : ''} onClick={() => handleFilterClick('important')}>
//             Important!
//           </li>
//           <li className={selectedFilter === 'completed' ? 'active' : ''} onClick={() => handleFilterClick('completed')}>
//             Completed!
//           </li>
//           <Button
//             variant="text"
//             onClick={() => setShowProjects(!showProjects)}
//             endIcon={<KeyboardArrowDown />}
//             style={{
//               width: '100%',
//               justifyContent: 'flex-start',
//               textTransform: 'none',
//               color: 'white',
//               fontSize: '16px',
//               marginLeft: '5%',
//             }}
//           >
//             Projects
//           </Button>
//           <Collapse in={showProjects}>
//             <div className="projects-dropdown">
//               {loading ? (
//                 <LoadingScreen />
//               ) : error ? (
//                 <p>No projects</p>
//               ) : (
//                 <List>
//                   {projects.map((project) => (
//                     <ListItem
//                       key={project.id}
//                       style={{
//                         backgroundColor: projectId === project.id ? '#4a90e2' : 'transparent',
//                         borderRadius: '4px',
//                         padding: '5px 10px',
//                         marginLeft: '5%',
//                       }}
//                       onClick={() => handleProjectSelection(project.id)}
//                     >
//                       <ListItemText primary={project.name} />

//                       {/* Only show the "+" button for the selected project */}
//                       {projectId === project.id && (

//                         <Button >
//                           <MdOutlineGroupAdd style={{ cursor: 'pointer', fontSize: '24px', color: 'white', marginRight: '-100%' }}
//                             onClick={(e) => {
//                               setOpenAddUserModal(true); // Open the modal to add a user
//                               e.stopPropagation(); // Prevent triggering the onClick for the ListItem
//                               console.log('Icon clicked'); // Debug statement
//                               selectProject(project.id); // Set the project as selected

//                             }}

//                           />
//                         </Button>

//                       )}
//                     </ListItem>
//                   ))}
//                 </List>

//               )}
//             </div>
//             <Button style={{ marginLeft: '20%', marginTop: '4%' }} variant="contained" color="primary" onClick={() => setOpenModal(true)}>
//               Add Project
//             </Button>
//           </Collapse>
//         </ul>
//       </nav>



//       <Modal
//         style={{
//           width: '23%',
//           backgroundColor: 'white',
//           height: '30%',
//           left: '40%',
//           top: '32%',
//           padding: '1%',
//           borderRadius: '2%',
//         }}
//         open={openModal}
//         onClose={() => setOpenModal(false)}
//         BackdropProps={{
//           style: {
//             backgroundColor: 'transparent',
//             backdropFilter: 'blur(2px)',
//           },
//         }}
//       >
//         <div>
//           <h2>Create New Project</h2>
//           <form onSubmit={handleCreateProject}>
//             <TextField
//               label="Project Name"
//               variant="outlined"
//               fullWidth
//               value={newProject.name}
//               onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
//               required
//               style={{ marginBottom: 20 }}
//             />
//             <TextField
//               label="Project Description"
//               variant="outlined"
//               fullWidth
//               value={newProject.description}
//               onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
//               required
//               style={{ marginBottom: 20 }}
//             />
//             <Button style={{ width: '40%', margin: '0 auto', display: 'block' }} type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
//               {loading ? 'Creating...' : 'Create Project'}
//             </Button>
//           </form>
//         </div>
//       </Modal>

//       <Modal
//         style={{
//           width: '23%',
//           backgroundColor: 'white',
//           height: '25%',
//           left: '40%',
//           top: '35%',
//           padding: '1%',
//           borderRadius: '2%',
//         }}
//         open={openAddUserModal}
//         onClose={() => setOpenAddUserModal(false)}
//         BackdropProps={{
//           style: {
//             backgroundColor: 'transparent',
//             backdropFilter: 'blur(2px)',
//           },
//         }}
//       >
//         <div>
//           <h2>Add User to Project</h2>
//           <TextField
//             label="Enter User Email"
//             variant="outlined"
//             fullWidth
//             value={emailToAdd}
//             onChange={(e) => setEmailToAdd(e.target.value)}
//             required
//             style={{ marginBottom: 20 }}
//           />
//           <Button style={{ width: '40%', margin: '0 auto', display: 'block' }} onClick={handleAddUserToProject} variant="contained" color="primary" fullWidth disabled={loading}>
//             {loading ? 'Adding...' : 'Add User'}
//           </Button>
//         </div>
//       </Modal>

//       <div className="sign-out-container" onClick={handleSignOut}>
//         <FaSignOutAlt className="sign-out-icon" />
//         <button className="sign-out">Sign Out</button>
//       </div>
//     </div>
//   );
// }

// export default Sidebar;






















import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../Context/UserContext';
import api from '../../api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { Modal, Button, TextField, Collapse, List, ListItem, ListItemText } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { MdOutlineGroupAdd } from "react-icons/md";
import LoadingScreen from '../Loader/Loading';
import { IoMdArrowRoundBack } from 'react-icons/io';
import './Sidebar.css';

function Sidebar({ setFilter, isOpen, setIsSidebarOpen }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [projectsCreatedByUser, setProjectsCreatedByUser] = useState([]);
  const [projectsAddedToUser, setProjectsAddedToUser] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [showProjects, setShowProjects] = useState(false);
  const [emailToAdd, setEmailToAdd] = useState(''); // Email input state for adding users
  const { user, setUser, isDarkMode, projectId, selectProject } = useContext(UserContext); // Access user, dark mode, and projectId from context
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const username = user?.username;
  const userId = user?.userId;
  const email = user?.email;

  // Fetch projects on load
  useEffect(() => {
    if (userId) {
      fetchProjects();
    } else {
      navigate('/todo');
    }
  }, [userId, navigate]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/projects/user/${userId}`);
      const { creatorProjects, participantProjects } = response.data;

      // Set the state for the creator and participant projects
      setProjectsCreatedByUser(creatorProjects);
      setProjectsAddedToUser(participantProjects);

    } catch (err) {
      setError('Failed to fetch projects. Please try again.');
      toast.error('Error fetching projects.');
    } finally {
      setLoading(false);
    }
  };



  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/createproject', {
        ...newProject,
        createdBy: email,
      });
      toast.success('Project created successfully.');
      setNewProject({ name: '', description: '' });
      fetchProjects();
      setOpenModal(false);
    } catch (err) {
      setError('Failed to create project. Please try again.');
      toast.error('Error creating project.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUserToProject = async () => {
    if (!emailToAdd) {
      toast.error('Please enter an email.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/projects/add-user', {
        projectId: projectId, // Pass the selected project ID
        userEmail: emailToAdd, // Pass the email of the user to be added
      });

      toast.success('User added to the project!');
      setEmailToAdd(''); // Reset email field
      setOpenAddUserModal(false); // Close the modal
    } catch (err) {
      toast.error('Error adding user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelection = (projectId) => {
    // Update the context and local storage
    selectProject(projectId);
    localStorage.setItem('selectedProjectId', projectId);
  };



  const handleFilterClick = (filter) => {
    setFilter(filter);
    setSelectedFilter(filter);
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div ref={sidebarRef} className={`sidebar ${isDarkMode ? 'dark' : ''} ${isOpen ? 'open' : 'closed'}`}>
      <IoMdArrowRoundBack className="back-btn" onClick={() => setIsSidebarOpen(false)} />
      <div className="profile">
        <img src="https://via.placeholder.com/100" alt="Profile" className="profile-img" />
        <h3 className="profile-name">Welcome, {username}</h3>
      </div>

      <nav className="nav">
        <ul>
          <li className={selectedFilter === 'all' ? 'active' : ''} onClick={() => handleFilterClick('all')}>
            All Tasks
          </li>
          <li className={selectedFilter === 'important' ? 'active' : ''} onClick={() => handleFilterClick('important')}>
            Important!
          </li>
          <li className={selectedFilter === 'completed' ? 'active' : ''} onClick={() => handleFilterClick('completed')}>
            Completed!
          </li>

          <Button
            variant="text"
            onClick={() => setShowProjects(!showProjects)}
            endIcon={<KeyboardArrowDown />}
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              textTransform: 'none',
              color: 'white',
              fontSize: '16px',
              marginLeft: '5%',
            }}
          >
            Projects
          </Button>

          <Collapse in={showProjects}>
            <div className="projects-dropdown">
              {loading ? (
                <LoadingScreen />
              ) : error ? (
                <p>No projects</p>
              ) : (
                <>
                  {/* Display Created Projects */}
                  <div className="projects-section">
                    <h3>Your Projects</h3>
                    <List>
                      {projectsCreatedByUser.length === 0 ? (
                        <ListItem>No projects created yet</ListItem>
                      ) : (
                        projectsCreatedByUser.map((project) => (
                          <ListItem
                            key={project.id}
                            style={{
                              backgroundColor: projectId === project.id ? '#4a90e2' : 'transparent',
                              borderRadius: '4px',
                              padding: '5px 10px',
                              marginLeft: '5%',
                            }}
                            onClick={() => handleProjectSelection(project.id)}
                          >
                            <ListItemText primary={project.name} />
                            <Button >
                              <MdOutlineGroupAdd style={{ cursor: 'pointer', fontSize: '24px', color: 'white', marginRight: '-100%' }}
                                onClick={(e) => {
                                  setOpenAddUserModal(true); // Open the modal to add a user
                                  e.stopPropagation(); // Prevent triggering the onClick for the ListItem
                                  console.log('Icon clicked'); // Debug statement
                                  selectProject(project.id); // Set the project as selected

                                }}

                              />
                            </Button>
                          </ListItem>
                        ))
                      )}
                    </List>
                  </div>

                  {/* Display Added Projects */}
                  <div className="projects-section">
                    <h3>Associated Projects </h3>
                    <List>
                      {projectsAddedToUser.length === 0 ? (
                        <ListItem>No projects added yet</ListItem>
                      ) : (
                        projectsAddedToUser.map((project) => (
                          <ListItem
                            key={project.id}
                            style={{
                              backgroundColor: projectId === project.id ? '#4a90e2' : 'transparent',
                              borderRadius: '4px',
                              padding: '5px 10px',
                              marginLeft: '5%',
                            }}
                            onClick={() => handleProjectSelection(project.id)}
                          >
                            <ListItemText primary={project.name} />
                          </ListItem>
                        ))
                      )}
                    </List>
                  </div>
                </>
              )}
            </div>
            <Button style={{ marginLeft: '20%', marginTop: '4%' }} variant="contained" color="primary" onClick={() => setOpenModal(true)}>
              Add Project
            </Button>
          </Collapse>

        </ul>
      </nav>

      <Modal
        style={{
          width: '23%',
          backgroundColor: 'white',
          height: '30%',
          left: '40%',
          top: '32%',
          padding: '1%',
          borderRadius: '2%',
        }}
        open={openModal}
        onClose={() => setOpenModal(false)}
        BackdropProps={{
          style: {
            backgroundColor: 'transparent',
            backdropFilter: 'blur(2px)',
          },
        }}
      >
        <div>
          <h2>Create New Project</h2>
          <form onSubmit={handleCreateProject}>
            <TextField
              label="Project Name"
              variant="outlined"
              fullWidth
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              required
              style={{ marginBottom: 20 }}
            />
            <TextField
              label="Project Description"
              variant="outlined"
              fullWidth
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              required
              style={{ marginBottom: 20 }}
            />
            <Button style={{ width: '40%', margin: '0 auto', display: 'block' }} type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </form>
        </div>
      </Modal>

      <Modal
        style={{
          width: '23%',
          backgroundColor: 'white',
          height: '25%',
          left: '40%',
          top: '35%',
          padding: '1%',
          borderRadius: '2%',
        }}
        open={openAddUserModal}
        onClose={() => setOpenAddUserModal(false)}
        BackdropProps={{
          style: {
            backgroundColor: 'transparent',
            backdropFilter: 'blur(2px)',
          },
        }}
      >
        <div>
          <h2>Add User to Project</h2>
          <TextField
            label="Enter User Email"
            variant="outlined"
            fullWidth
            value={emailToAdd}
            onChange={(e) => setEmailToAdd(e.target.value)}
            required
            style={{ marginBottom: 20 }}
          />
          <Button style={{ width: '40%', margin: '0 auto', display: 'block' }} onClick={handleAddUserToProject} variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? 'Adding...' : 'Add User'}
          </Button>
        </div>
      </Modal>

      <div className="sign-out-container" onClick={handleSignOut}>
        <FaSignOutAlt className="sign-out-icon" />
        <button className="sign-out">Sign Out</button>
      </div>
    </div>
  );
}

export default Sidebar;
