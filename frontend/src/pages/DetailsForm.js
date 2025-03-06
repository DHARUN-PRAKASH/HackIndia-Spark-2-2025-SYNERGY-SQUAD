import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
} from "@mui/material";
import Dash from "../components/Dash";
import { useNavigate } from "react-router-dom"; 

const DetailsForm = () => {
  const [formData, setFormData] = useState({
    Name: "",
    College: "",
    Department: "",
  });

  const [details, setDetails] = useState([]);
  const navigate = useNavigate();

  // Fetch UniqueId from sessionStorage
  const uuid = sessionStorage.getItem("unique_id");

  console.log("Fetched UUID from sessionStorage:", uuid);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!uuid) {
      alert("Error: Unique ID not found in session storage.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:5000/details/postdetails",
        formData, // Send only form data in the body
        {
          headers: {
            "x-unique-id": uuid, // Send UniqueId in the headers
          },
        }
      );
  
      console.log("Data submitted successfully with UUID:", uuid);
      alert("Details added successfully!");
      fetchDetails();
    } catch (error) {
      console.error("Error submitting details:", error.response?.data || error.message);
      alert("Error submitting details.");
    }
  };
  

  // Fetch all details
  const fetchDetails = async () => {
    try {
      const response = await axios.get("http://localhost:5000/details/getdetails");
      setDetails(response.data);
    } catch (error) {
      console.error("Error fetching details:", error.response?.data || error.message);
    }
  };

  // Load details on component mount
  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <>
      <Dash />
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 3, mt: 5,borderRadius: '50px' }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            style={{ backgroundColor: "#ff7921", color: "#fff", textAlign: "center", borderRadius: "10px" }}
          >
            <b>FORM</b>
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Name"
              name="Name"
              variant="outlined"
              value={formData.Name}
              onChange={handleChange}
              required
            />
            <TextField
              label="College"
              name="College"
              variant="outlined"
              value={formData.College}
              onChange={handleChange}
              required
            />
            <TextField
              label="Department"
              name="Department"
              variant="outlined"
              value={formData.Department}
              onChange={handleChange}
              required
            />
            <Button type="submit" variant="contained" color="primary" style={{color: "#fff", backgroundColor: "#004e00",borderRadius: '50px'}}>
              Submit
            </Button>
          </Box>
        </Paper>

        {/* <Paper elevation={3} sx={{ p: 3, mt: 5 }}>
          <Typography variant="h5" gutterBottom>
            Details List
          </Typography>
          <List>
            {details.map((detail) => (
              <ListItem key={detail._id} divider>
                <ListItemText primary={`${detail.Name} - ${detail.College} (${detail.Department})`} />
              </ListItem>
            ))}
          </List>
        </Paper> */}

{/* View Certificate Button */}
<Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: "center",borderRadius: '50px' }}>
          <Typography variant="h6" gutterBottom>
            View Your Certificate
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            style={{color: "#fff", backgroundColor: "#004e00",borderRadius: '50px'}}
            onClick={() => navigate("/View_Certificate")} // Navigate to ViewCertificate page
          >
            View Certificate
          </Button>
        </Paper>

      </Container>
    </>
  );
};

export default DetailsForm;