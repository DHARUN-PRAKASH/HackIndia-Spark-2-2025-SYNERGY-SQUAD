import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import Dash from "../components/Dash";

const ViewCertificate = () => {
  const [uniqueId, setUniqueId] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Retrieve logged-in user details from sessionStorage
    const loggedUser = sessionStorage.getItem("logged");

    if (loggedUser) {
      const user = JSON.parse(loggedUser); // Parse JSON string to object
      setUniqueId(user.unique_id);
      setUsername(user.username);
    } else {
      setError("User details not found in session.");
    }
  }, []);

  const fetchCertificate = async () => {
    if (!uniqueId.trim()) {
      setError("Invalid Unique ID. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/certficate/api/get-certificate/${uniqueId}`
      );

      if (!response.ok) {
        throw new Error("Certificate not found");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank"); // Opens PDF in a new tab
      setError("");
    } catch (error) {
      setError("Certificate not found or server error");
      console.error("Error fetching certificate:", error);
    }
  };

  return (
    <>
      <Dash />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Paper
          elevation={3}
          sx={{ padding: 4, textAlign: "center", maxWidth: 400 ,borderRadius:'50px'}}
        >
          <Typography variant="h5" gutterBottom>
            <b>VIEW CERTIFICATE</b>
          </Typography>

          {username && (
            <Typography variant="subtitle1" gutterBottom>
              <strong>Logged in as:</strong> {username}
            </Typography>
          )}

          <Typography variant="subtitle1" gutterBottom>
            <strong>Unique ID:</strong> {uniqueId || "Not Found"}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={fetchCertificate}
            sx={{ mt: 2, width: "100%",borderRadius: '50px',backgroundColor: "#004e00", color: "#fff" }}
            disabled={!uniqueId}
          >
            View Certificate
          </Button>

          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default ViewCertificate;