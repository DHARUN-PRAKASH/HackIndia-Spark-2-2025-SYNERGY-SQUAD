import React, { useState } from "react";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Grid,
  styled,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import logo from "./Zealous.png"; // Import the image

const DragAndDropArea = styled(Box)(({ theme }) => ({
  width: "50%",
  height: "150px",
  margin: "20px auto",
  border: "2px dashed orange",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f9f9f9",
  color: "blue",
  textAlign: "center",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "orange",
    color: "white",
  },
}));

const CsvUploader = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const selectedColumns = [
    "BillNo",
    "Name",
    "Amount",
    "Date",
    "Course",
    "Address",
    "Contact",
    "Email",
  ];

  const handleFileUpload = (file) => {
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setData(result.data);
        },
        error: (err) => {
          setError(err.message);
        },
      });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const columns = selectedColumns.map((field) => ({
    field,
    headerName: field,
    flex: 1,
  }));

  const rows = data.map((row, index) => ({
    id: index + 1,
    ...row,
  }));

  const viewPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a5",
    });
  
    let Xaxis = 10;
    let Yaxis = 10;
  
    data.forEach((row, index) => {
      if (index > 0) {
        doc.addPage(); // Add a new page for each record
      }
  
      // Add the horizontal and vertical boundary lines
      const leftX = Xaxis - 2; // Left margin
      const rightX = Xaxis + 130; // Right margin
      const topY = Yaxis + 10; // Top margin
      const bottomY = Yaxis + 180; // Bottom margin
  
      // Draw the rectangle border
      doc.setDrawColor(255, 165, 0); // Orange color
      doc.setLineWidth(0.5);
      doc.line(leftX, topY, rightX, topY); // Top horizontal line
      doc.line(leftX, topY, leftX, bottomY); // Left vertical line
      doc.line(rightX, topY, rightX, bottomY); // Right vertical line
      doc.line(leftX, bottomY, rightX, bottomY); // Bottom horizontal line
  
      // Add the logo
      doc.addImage(logo, "PNG", Xaxis + 35, Yaxis - 15, 60, 30);
  
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text("BILLING VOUCHER", Xaxis + 67, Yaxis + 17, "center");
  
      doc.setFont("times", "normal");
      doc.setFontSize(12);
      doc.text("To:", Xaxis + 7, Yaxis + 27);
      doc.text(row["Name"] || "", Xaxis + 15, Yaxis + 31);
      doc.text(row["Address"] || "", Xaxis + 15, Yaxis + 35);
      doc.text(row["Contact"] || "", Xaxis + 15, Yaxis + 40);
      doc.text(row["Email"] || "", Xaxis + 15, Yaxis + 45);
  
      doc.text("Bill No:", Xaxis + 95, Yaxis + 27);
      doc.text(row["BillNo"] || "", Xaxis + 110, Yaxis + 27);
      doc.text("Date:", Xaxis + 95, Yaxis + 32);
      doc.text(row["Date"] || "", Xaxis + 105, Yaxis + 32);
  
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(Xaxis + 5, Yaxis + 50, Xaxis + 120, Yaxis + 50);
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text("Course", Xaxis + 40, Yaxis + 56);
      doc.text("Amount", Xaxis + 95, Yaxis + 56);
      doc.line(Xaxis + 5, Yaxis + 60, Xaxis + 120, Yaxis + 60);
  
      doc.setFont("times", "normal");
      doc.setFontSize(12);
      doc.text(row["Course"] || "", Xaxis + 40, Yaxis + 75);
      doc.text(row["Amount"] || "", Xaxis + 95, Yaxis + 75);
  
      doc.line(Xaxis + 85, Yaxis + 100, Xaxis + 85, Yaxis + 50);
  
      doc.line(Xaxis + 5, Yaxis + 90, Xaxis + 120, Yaxis + 90);
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text("Total", Xaxis + 40, Yaxis + 96);
      doc.text(row["Amount"] || "", Xaxis + 95, Yaxis + 96);
  
      doc.line(Xaxis + 5, Yaxis + 100, Xaxis + 120, Yaxis + 100);
  
      doc.setFont("times", "normal");
      doc.setFontSize(12);
      doc.text("*TERMS & CONDITIONS", Xaxis + 5, Yaxis + 115);
  
      const text1 =
        "- It is the sole responsibility of the student enrolling for the program to check the accuracy and evaluate the sustainability and relevance of the program elected.";
      const maxWidthText1 = 130;
      doc.text(text1, Xaxis + 5, Yaxis + 122, {
        maxWidth: maxWidthText1,
        align: "left",
      });
  
      const text2 =
        "- No refund will be made once the payment for the program has been made.";
      doc.text(text2, Xaxis + 5, Yaxis + 137, {
        maxWidth: maxWidthText1 - 5,
        align: "left",
      });
  
      const text3 = "- This is a computer generated voucher.";
      doc.text(text3, Xaxis + 5, Yaxis + 147, {
        maxWidth: maxWidthText1,
        align: "left",
      });
  
      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.text("Phn No:0987654321", Xaxis + 10, Yaxis + 160);
      doc.text("Email:abc123@gmail.com", Xaxis + 10, Yaxis + 165);
    });
  
    // Open in a new tab
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);
  };
  

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            E-BILL
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <DragAndDropArea
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            backgroundColor: isDragging ? "orange" : "#f9f9f9",
            color: isDragging ? "white" : "blue",
          }}
        >
          <Typography>
            Drag and drop your CSV file here, or <b>click to browse</b>
          </Typography>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            style={{
              position: "absolute",
              opacity: 0,
              cursor: "pointer",
              width: "100%",
              height: "100%",
            }}
          />
        </DragAndDropArea>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={viewPDF}>
              View PDF
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <DataGrid
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            rows={rows}
            columns={columns}
            autoHeight
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "orange",
                color: "black",
              },
              "& .MuiDataGrid-row:nth-of-type(odd)": {
                backgroundColor: "#f9f9f9",
              },
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: "white",
              },
              "& .MuiDataGrid-cell": {
                color: "black",
              },
            }}
          />
        </Box>
      </Box>
    </div>
  );
};

export default CsvUploader;
