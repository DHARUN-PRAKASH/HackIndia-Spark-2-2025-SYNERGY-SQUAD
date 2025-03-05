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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import hackindia from "../assest/hackindia.png";
import mec from "../assest/mec.png";
import html2canvas from "html2canvas";
import Dash from "../components/Dash";


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



const CertificateApp = () => {
  const [csvData, setCsvData] = useState([]);
  const [isDraggingOverPage, setIsDraggingOverPage] = useState(false);

  useEffect(() => {
    const handleDragOver = (event) => {
      event.preventDefault();
      setIsDraggingOverPage(true);
    };

    const handleDragLeave = (event) => {
      if (event.relatedTarget === null) {
        setIsDraggingOverPage(false);
      }
    };

    const handleDrop = (event) => {
      event.preventDefault();
      setIsDraggingOverPage(false);
      const file = event.dataTransfer.files[0];
      handleFileUpload(file);
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleFileUpload = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => setCsvData(results.data),
    });
  };

  const handleGenerateAll = async () => {
    csvData.forEach(async (participant) => {
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

        // Adding certificate title
        certificateDiv.innerHTML = `
            <img src="output-onlinepngtools (3).png" style="position: absolute; top: 60px; font-size: 36px; font-weight: bold; color: #333;">
                
            </img>
            <p style="position: absolute; top: 170px; font-size: 24px; color: #222; font-weight: bold; font-family: 'Playfair Display', serif;">
    ${participant.Name} 
</p>

            <img src="output-onlinepngtools (1).png" style="position: absolute; top: 240px; height: 40px; font-weight: bold; ;">
               
            </img>
            <img src="output-onlinepngtools.png" style="position: absolute; top: 280px; font-size: 20px; color: #000; font-weight: 600;">
                
            </img>
            <p style="position: absolute; top: 400px; font-size: 24px; color: #222; font-weight: bold; font-family: 'Playfair Display', serif;">
    MUTHAYAMMAL ENGINEERING COLLEGE
</p>            <!-- Adding the uploaded images -->
            <img src="Screenshot 2025-03-04 130713.png" style="position: absolute; top: 15px; left: 20px; width: 180px; height: auto;">
            <img src="output-onlinepngtools (2).png" style="position: absolute; top: 20px; right: 20px; width: 120px; height: auto;">
           

           <div style="position: absolute; bottom: 30px; width: 100%; display: flex; align-items: flex-end; font-size: 16px; font-style: italic;">
    <!-- Bottom-left corner -->
    <div style="position: absolute; left: 40px; bottom: 10px; text-align: left;">
        <strong style="display: block; text-align: center;">Mahesh Chand</strong>
        <span>Founder and CEO CSharp Inc.</span>
    </div>

    <!-- Center -->
    <div style="width: 100%; display: flex; justify-content: center; position: absolute; bottom: 10px;">
        <div style="text-align: center;">
            <strong style="display: block;">Ivan Kan</strong>
            <span>CMO CSharp Inc.</span>
        </div>
    </div>

    <!-- Bottom-right corner -->
    <div style="position: absolute; right: 40px; bottom: 10px; text-align: right;">
        <strong style="display: block; text-align: center;">Stephen SIMON</strong>
        <span>Director - HackIndia</span>
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
          formData.append("file", pdfBlob, `${participant.Name}_certificate.pdf`);
          formData.append("userId", participant.userId || `user_${Math.random().toString(36).substr(2, 9)}`);
          
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
    });
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
      <Dash/>

      {/* Full-screen overlay when dragging */}
      {isDraggingOverPage && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            fontWeight: "bold",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          Drop file to upload
        </Box>
      )}

      <Box sx={{ p: 2 }}>

        <Button variant="contained" color="primary" onClick={handleGenerateAll}>
          Download All Certificates
        </Button>

        <DataGrid rows={rows} columns={columns} autoHeight />
      </Box>
    </div>
  );
};

export default CertificateApp;