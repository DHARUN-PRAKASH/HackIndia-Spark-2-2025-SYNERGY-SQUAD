const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); 

const Certificate = require("../models/Certficate"); // New model for storing certificate info

// -------------------- CERTIFICATE STORAGE API --------------------

// Create "uploads" folder if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `certificate_${Date.now()}.pdf`);
  },
});

const upload = multer({ storage });

router.post("/api/store-certificate", upload.single("file"), async (req, res) => {
  try {
    console.log("Request Body:", req.body); // ✅ Log the full body
    console.log("Request File:", req.file); // ✅ Log uploaded file details

    let unique_id = req.body.unique_id ? req.body.unique_id.trim() : null;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!unique_id) {
      return res.status(400).json({ message: "Unique ID is required" });
    }

    console.log("Received Unique ID:", unique_id);

    // Check if the certificate already exists for this user
    const existingCertificate = await Certificate.findOne({ unique_id });
    if (existingCertificate) {
      return res.status(409).json({ message: "Certificate already exists for this Unique ID" });
    }

    // Save the certificate in MongoDB
    const newCertificate = await Certificate.create({
      unique_id,
      filePath: req.file.path,
    });

    res.json({ message: "Certificate stored successfully", unique_id, filePath: req.file.path });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/api/get-certificate/:unique_id", async (req, res) => {
  try {
    const { unique_id } = req.params;

    // Find certificate in the database
    const certificate = await Certificate.findOne({ unique_id });

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    const filePath = path.join(__dirname, "../", certificate.filePath);

    // Check if file exists on the server
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // Serve the file
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;