const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config(); 

const User = require("../models/Users");
const auth = require("../middleware/authMiddleware");
const { v4: uuidv4 } = require('uuid'); // Import UUID generator


// Login User and generate JWT token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Compare the entered password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // If the password matches, create a JWT token
    const token = jwt.sign(
      {
        userId: user._id,  // Include the user ID or any data you want to encode
        username: user.username,
        admin: user.admin,  // Directly use 'admin' field from the database (true or false)
        unique_id: user.unique_id
      },
      process.env.JWT_SECRET, // Use the secret key from the .env file
      { expiresIn: '10h' }  // Token expiration time (10 hours in this case)
    );

    // Return the JWT token and user information
    res.status(200).json({
      msg: 'Login successful',
      token,  // The JWT token
      user: { username: user.username, email: user.email, admin: user.admin ,unique_id:user.unique_id}  // Return the 'admin' status directly
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});



router.get('/profile', auth, (req, res) => {
  // You can now access `req.user`, which contains the decoded token data
  res.json({ msg: 'Profile data', user: req.user });
});


// Get all users (protected)
router.get("/getAllUsers", auth , async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Get user by ID (protected)
router.get("/getUserById/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Check if username exists
router.post("/check-username", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ msg: "Username is required" });
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ msg: "Username already exists" });
    }

    return res.status(200).json({ msg: "Username is available" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});


// Check if email exists
router.post("/check-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    return res.status(200).json({ msg: "Email is available" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});


router.post("/addUser", async (req, res) => {
  const { name, username, email, password, contact, admin } = req.body;

  // Validate required fields
  if (!name || !username || !email || !password || !contact || admin === undefined) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    // Check for duplicates only on username, email, and contact
    const existingUser = await User.findOne({ $or: [{ username }, { email }, { contact }] });
    if (existingUser) {
      // Determine which field is causing the duplicate error
      const duplicateField = existingUser.username === username ? 'username' : 
                             existingUser.email === email ? 'email' : 
                             existingUser.contact === contact ? 'contact' : '';
      return res.status(400).json({ msg: `${duplicateField} already exists!` });
    }

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user object
    const newUser = new User({
      unique_id: uuidv4(), // Assign a unique ID
      name,
      username,
      email,
      password: hashedPassword,  // Store hashed password
      contact,
      admin,
    });

    // Save user to database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});







// Update user by ID (protected)
router.put("/updateUser/:id", auth, async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Optional: Add role-based or owner-based validation
    // if (req.user.id !== user.id && req.user.role !== "admin") {
    //   return res.status(403).json({ msg: "Authorization denied" });
    // }

    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Delete user by ID (protected)
router.delete("/deleteUser/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Optional: Add role-based or owner-based validation
    // if (req.user.id !== user.id && req.user.role !== "admin") {
    //   return res.status(403).json({ msg: "Authorization denied" });
    // }

    await user.deleteOne(); // Use deleteOne instead of remove
    res.json({ msg: "User removed" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});


module.exports = router;