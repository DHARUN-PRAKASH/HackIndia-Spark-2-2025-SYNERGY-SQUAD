import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Button, Typography, Paper } from "@mui/material";
import { SaveAlt as SaveAltIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import Dash from "../components/Dash";

const DetailsTable = () => {
  const [details, setDetails] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();

  // Fetch data from backend
  const fetchDetails = async () => {
    try {
      const response = await axios.get("http://localhost:5000/details/getdetails");
      setDetails(response.data);
    } catch (error) {
      console.error("Error fetching details:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  // Handle CSV Download
  const handleDownloadCSV = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row to download.");
      return;
    }

    // Filter selected rows
    const selectedData = details
      .filter((row) => selectedRows.includes(row._id))
      .map(({ UniqueId, Name, College, Department }) => ({
        UniqueID: UniqueId,
        Name,
        College,
        Department,
      }));

    console.log("Downloading CSV with selected data:", selectedData);

    // Convert to CSV format
    const csv = Papa.unparse(selectedData);

    // Create a Blob and trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "selected_details.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Navigate to the next page
  const handleNextPage = () => {
    navigate("/generate"); // Change this to your actual next page route
  };

  // Define columns with updated header styles
  const columns = [
    { field: "Name", headerName: "Name", flex: 1, headerClassName: "custom-header" },
    { field: "College", headerName: "College", flex: 1, headerClassName: "custom-header" },
    { field: "Department", headerName: "Department", flex: 1, headerClassName: "custom-header" },
    { field: "ID", headerName: "UniqueID", flex: 1, headerClassName: "custom-header" },
  ];

  return (
    <>
      <Dash />
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: "50px" }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            style={{ backgroundColor: "#ff7921", color: "#fff", textAlign: "center", borderRadius: "50px" }}
          >
            <b>REPORT</b>
          </Typography>

          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={details.map((row) => ({ id: row._id, ...row }))}
              columns={columns}
              checkboxSelection
              onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
              sx={{
                "& .custom-header": {
                  backgroundColor: "#fffff",
                  color: "#004e00",
                  fontSize: "16px",
                  fontWeight: "bold",
                },
              }}
            />
          </div>

          <Button
            variant="contained"
            startIcon={<SaveAltIcon />}
            sx={{ mt: 2, mr: 2,borderRadius: '50px',backgroundColor: "#004e00", color: "#fff" }}
            onClick={handleDownloadCSV}
          >
            <b>DOWNLOAD CSV</b>
          </Button>

          {/* Next Page Button */}
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ArrowForwardIcon />}
            sx={{ mt: 2, mr: 2,borderRadius: '50px',backgroundColor: "#004e00", color: "#fff"  }}
            onClick={handleNextPage}
          >
            <b>NEXT PAGE</b>
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default DetailsTable;