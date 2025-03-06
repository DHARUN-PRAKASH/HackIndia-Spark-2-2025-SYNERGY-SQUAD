import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import jsPDF from "jspdf";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Grid,
  styled,
  Input,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import html2canvas from "html2canvas";
import Dash from "../components/Dash";

const UploadButton = styled(Button)({
  backgroundColor: "#006400",
  color: "white",
  fontSize: "18px",
  padding: "15px 40px",
  borderRadius: "8px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#004d00",
  },
});

const CertificateApp = () => {
  const [csvData, setCsvData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => setCsvData(results.data),
      });
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const handleGenerateAll = async () => {
    for (const participant of csvData) {
      // Check all possible variations of unique ID field names
      let uniqueId = participant.UniqueID || participant.unique_id || participant.uniqueId;
  
      if (!uniqueId) {
        console.error(`Skipping participant: Unique ID missing`, participant);
        continue;
      }
  
      console.log(`Processing: ${participant.Name}, Unique ID: ${uniqueId}`);
  
      const certificateDiv = document.createElement("div");
      certificateDiv.style.width = "900px";
      certificateDiv.style.height = "600px";
      certificateDiv.style.backgroundImage = "url('/snapedit_1741159037815.jpg')";
      certificateDiv.style.backgroundSize = "cover";
      certificateDiv.style.position = "relative";
      certificateDiv.style.display = "flex";
      certificateDiv.style.flexDirection = "column";
      certificateDiv.style.alignItems = "center";
      certificateDiv.style.justifyContent = "center";
      certificateDiv.style.fontFamily = "Arial, sans-serif";
  
      certificateDiv.innerHTML = `
          <img src="output-onlinepngtools (3).png" style="position: absolute; top: 60px;"></img>
          <p style="position: absolute; top: 170px; font-size: 24px; color: #222; font-weight: bold;">
            ${participant.Name} 
          </p>
          <img src="output-onlinepngtools (1).png" style="position: absolute; top: 240px; height: 40px;"></img>
          <img src="output-onlinepngtools.png" style="position: absolute; top: 280px;"></img>
          <p style="position: absolute; top: 400px; font-size: 24px; font-weight: bold;">
            MUTHAYAMMAL ENGINEERING COLLEGE
          </p> 
          <img src="Screenshot 2025-03-04 130713.png" style="position: absolute; top: 15px; left: 20px; width: 180px;">
          <img src="output-onlinepngtools (2).png" style="position: absolute; top: 20px; right: 20px; width: 120px;">
          <div style="position: absolute; bottom: 30px; width: 100%; display: flex; align-items: flex-end; font-size: 16px;">
            <div style="position: absolute; left: 40px; bottom: 10px;">
              <strong>Mahesh Chand</strong><br><span>Founder and CEO CSharp Inc.</span>
            </div>
            <div style="width: 100%; display: flex; justify-content: center; position: absolute; bottom: 10px;">
              <strong>Ivan Kan</strong><br><span>CMO CSharp Inc.</span>
            </div>
            <div style="position: absolute; right: 40px; bottom: 10px;">
              <strong>Stephen SIMON</strong><br><span>Director - HackIndia</span>
            </div>
          </div>
      `;
  
      document.body.appendChild(certificateDiv);
  
      html2canvas(certificateDiv, { scale: 2 }).then(async (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("landscape", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${participant.Name}_certificate.pdf`);
  
        const pdfBlob = pdf.output("blob");
        const formData = new FormData();
        formData.append("file", pdfBlob, `${participant.Name}_certificate.pdf`,uniqueId);
        formData.append("unique_id", uniqueId); // Ensure unique ID is sent correctly
  
        try {
          const response = await fetch("http://localhost:5000/certficate/api/store-certificate", {
            method: "POST",
            body: formData,
          });
  
          const result = await response.json();
          console.log("Upload response:", result);
        } catch (error) {
          console.error("Error uploading certificate:", error);
        }
      });
    }
  };

  const columns = Object.keys(csvData[0] || {}).map((key) => ({
    field: key,
    headerName: key,
    flex: 1,
  }));

  const rows = csvData.map((row, index) => ({
    id: index + 1,
    ...row,
  }));

  return (
    <div>
      <Dash />
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
        {/* Upload CSV Button */}
        <input
          accept=".csv"
          id="csv-upload"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <label htmlFor="csv-upload">
          <UploadButton component="span">Upload CSV</UploadButton>
        </label>

        {/* Data Table */}
        {csvData.length > 0 && (
          <Box sx={{ width: "80%", mt: 3 }}>
            <DataGrid rows={rows} columns={columns} autoHeight />
          </Box>
        )}

        {/* Download Button */}
        {csvData.length > 0 && (
          <Button
            variant="contained"
            sx={{ backgroundColor: "#006400", color: "white", mt: 3 }}
            onClick={handleGenerateAll}
          >
            Download All Certificates
          </Button>
        )}
      </Box>
    </div>
  );
};

export default CertificateApp;
