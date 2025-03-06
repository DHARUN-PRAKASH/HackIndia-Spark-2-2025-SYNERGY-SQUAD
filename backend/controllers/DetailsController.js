const express = require("express");
const router = express.Router();
const Details = require("../models/Details");

// Add Details using UniqueId from sessionStorage
router.post("/postdetails", async (req, res) => {
    try {
        const { Name, College, Department } = req.body;
        const uniqueId = req.headers["x-unique-id"]; // Fetch UniqueId from headers

        if (!Name || !College || !Department || !uniqueId) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // Save details with the existing UniqueId
        const newDetail = new Details({
            Name,
            College,
            Department,
            UniqueId: uniqueId, 
        });

        await newDetail.save();
        res.status(201).json(newDetail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Details
router.get("/getdetails", async (req, res) => {
    try {
        const details = await Details.find();
        res.status(200).json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;