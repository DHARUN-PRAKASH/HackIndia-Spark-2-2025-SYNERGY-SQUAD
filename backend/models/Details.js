const mongoose = require("mongoose");

const DetailsSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  College: {
    type: String,
    required: true,
  },
  Department: {
    type: String,
    required: true,
  },
  UniqueId: {
    type: String,
    required: true, // UniqueId now comes from UserSchema
    ref: "User"// Reference to User Schem
  },
});

module.exports = mongoose.model("Details", DetailsSchema);