const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID for unique_id

const UserSchema = new mongoose.Schema(
  {
    unique_id: {
      type: String,
      unique: true, // Ensures unique value
      default: uuidv4, // Automatically generates a UUID
    },
    name: {
      type: String,
      required: true, // Name can have duplicates
    },
    username: {
      type: String,
      required: true,
      unique: true, // Ensures unique usernames
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures unique emails
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
      unique: true, // Ensures unique contact numbers
    },
    admin: {
      type: Boolean,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
