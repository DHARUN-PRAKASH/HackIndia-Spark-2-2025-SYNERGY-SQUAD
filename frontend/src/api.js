import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Adjust this to match your API endpoint

// Function for adding a user
export const addUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/addUser`, userData);
    return response.data; // Return the data received from the server
  } catch (error) {
    console.error('Error adding user:', error);
    throw error; // Throw error to be caught by the calling function
  }
};

// Function for logging in a user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    return response.data; // Return the data received from the server
  } catch (error) {
    console.error('Error logging in:', error);
    throw error; // Throw error to be caught by the calling function
  }
};
