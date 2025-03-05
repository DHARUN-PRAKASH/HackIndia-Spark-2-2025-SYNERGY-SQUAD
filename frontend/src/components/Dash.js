import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
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

    // Ensure navigation is done after clearing sessionStorage
    window.location.assign("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Project
        </Typography>

        <Box>
          {/* Account Icon Button */}
          <IconButton
            edge="end"
            color="inherit"
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
          >
            {/* Display Username */}
            <MenuItem disabled>{username}</MenuItem>

            {/* Logout Button */}
            <MenuItem onClick={handleLogout}>
              <ExitToAppIcon sx={{ marginRight: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Dash;
