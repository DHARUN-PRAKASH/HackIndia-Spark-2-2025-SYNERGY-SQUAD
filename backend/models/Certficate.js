const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  filePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Certificate", CertificateSchema);
