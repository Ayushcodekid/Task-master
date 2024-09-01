import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css";

export default function MenuAppBar() {
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const sideList = () => (
    <Box
      className="sidebar"
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List className='menu-list'> 
        <ListItem button component={Link} to="/todo">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/todo">
          <ListItemText primary="Profile" />
        </ListItem>
        {/* Add more list items as needed */}
      </List>
      <Divider />
      <List>
        <ListItem button component={Link} to="/todo">
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar className="navbar-top">
        <Toolbar>
          <IconButton className='menu-btn' onClick={toggleDrawer(true)} >
            <MenuIcon />
          </IconButton>
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Application
          </Typography> */}

        </Toolbar>
      </AppBar>

      {drawerOpen && (
        <div className='background-drawer'
          onClick={toggleDrawer(false)}>

        </div>
      )}

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {sideList()}
      </Drawer>
    </Box>
  );
}
