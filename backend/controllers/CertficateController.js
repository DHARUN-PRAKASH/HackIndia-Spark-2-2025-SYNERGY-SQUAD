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
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Save file path in MongoDB
    const newCertificate = await Certificate.create({
      filePath: req.file.path,
    });

    res.json({ message: "Certificate stored successfully", filePath: req.file.path });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;