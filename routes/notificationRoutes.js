const express = require("express");
const bcrypt = require('bcrypt');

const router = express.Router();

// auth object for authorization
const auth = require("../auth");

// Notification model
const Notification = require("../db/notificationModel");

// Utilities for email sending
const util = require("../utilities/util");

// Notification Creation Endpoint
router.post("/notification", auth, async (req, res) => {
  try {
    
    const newNotification = new Notification({ ...req.body });
    await newNotification.save();

    res.status(201).json({ message: "Notification created successfully" });
  } catch (err) {
    console.error(err);
    console.log(req.body);
    res.status(500).json({ message: "Server error" });
  }
});

// Define the route for retrieving all notifications
router.get("/notification", auth, async (req, res) => {
  try {
    // Fetch all notifications from the database
    const notifications = await Notification.find().limit(50).sort({ time: -1 });

    // Return the list of notifications
    res.status(200).json(notifications);
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
