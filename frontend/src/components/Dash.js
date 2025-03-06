import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from 'react-router-dom';

const Dash = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Retrieve username from sessionStorage when the component mounts
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('logged'));
    if (user) {
      setUsername(user.username); // Set the username from sessionStorage
    }
  }, []);

  // Handle opening the account menu
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing the account menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.clear();  // Clear sessionStorage
    window.location.assign("/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#ff7921' }}>
      <Toolbar>
        <DashboardIcon sx={{ marginRight: 1, color: 'white' }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'white' }}>
          HACKINDIA
        </Typography>

        <Box>
          {/* Account Icon Button */}
          <IconButton
            edge="end"
            sx={{ color: 'white' }}
            aria-label="account"
            onClick={handleMenu}
            size="large"
          >
            <AccountCircleIcon />
          </IconButton>

          {/* User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: '#ff7921',
                color: 'white',
              },
            }}
          >
            {/* Display Username */}
            <MenuItem disabled sx={{ fontWeight: 'bold' }}>{username}</MenuItem>

            {/* Logout Button */}
            <MenuItem 
              onClick={handleLogout} 
              sx={{ '&:hover': { backgroundColor: '#e66b1e' } }}
            >
              <ExitToAppIcon sx={{ marginRight: 1, color: 'white' }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Dash;