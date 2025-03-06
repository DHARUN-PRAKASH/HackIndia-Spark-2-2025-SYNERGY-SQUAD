const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  filePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  unique_id: { // Changed from UniqueId to match frontend/backend
    type: String,
    required: true,
    ref: "User"
  }
});


module.exports = mongoose.model("Certificate", CertificateSchema);