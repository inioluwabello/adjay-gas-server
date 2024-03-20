const express = require("express");
const bcrypt = require('bcrypt');
var crypto = require('crypto');
const router = express.Router();

const jwt = require("jsonwebtoken");
const auth = require("./auth");

const User = require("./db/userModel");

// Login Endpoint
router.post("/login", async (request, response) => {

  const {email, password } = request.body;
  const user = await User.findOne(email);

  if (!user) {
    return response.status(404).send({
      message: "User not found",
      error,
    });
  }
  bcrypt
    .compare(password, user.password)
    .then((passwordCheck) => {
      // check if password matches
      if (!passwordCheck) {
        return response.status(400).send({
          message: "Passwords does not match",
          error,
        });
      }

      //   create JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          userEmail: user.email,
        },
        "RANDOM-TOKEN",
        { expiresIn: "24h" }
      );

      //   return success response
      response.status(200).send({
        message: "Login Successful",
        user: user,
        token,
      });
    })
    // catch error if password does not match
    .catch((error) => {
      response.status(400).send({
        message: "Passwords does not match",
        error,
      });
    });
});

const util = require("./utilities/util");

// User Creation Endpoint
router.post("/users", async (req, res) => {
  const { email, dob, gender, lastname, othername, phone, address } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(200).json({ message: "User already exists" });
    }

    const passwordResetToken = randomValueHex(25);
    // Create a new user
    const newUser = new User({ email, password: passwordResetToken, dob, gender, lastname, othername, phone, address, passwordResetToken });
    await newUser.save();

    // Send account completion email
    util.sendEmail(email, "Welcome, complete your account", `Hello ${lastname},<br /><br />Welcome to Adjay Gas CRM. Your account has been created. Please follow the link below to complete your registration.<br /><a href='https://adjay-gas.vercel.app/reset-password?userId=${newUser._id}&t=${passwordResetToken}'>https://adjay-gas.vercel.app/reset-password?userId=${newUser._id}&t=${passwordResetToken}</a>`);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    console.log(req.body);
    res.status(500).json({ message: "Server error" });
  }
});

// Update User Details Endpoint
router.put("/users/:id", auth, async (req, res) => {
  const userId = req.params.id;
  const { lastname, othername, phone, dob, gender, address } = req.body;

  try {
    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.lastname = lastname || user.lastname;
    user.othername = othername || user.othername;
    user.phone = phone || user.phone;
    user.dob = dob || user.dob;
    user.gender = gender || user.gender;

    await user.save();

    res.status(200).json({ message: "User details updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update User Details Endpoint
router.put("/users/update-password/:id", async (req, res) => {
  const userId = req.params.id;
  const { password, passwordResetToken } = req.body;
  console.log(userId, password, passwordResetToken);

  try {
    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.passwordResetToken !== passwordResetToken) {
      return res.status(400).json({ message: "Password reset token not found"})
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user details
    user.password = hashedPassword;
    user.passwordResetToken = null;
    await user.save();

    res.status(200).json({ message: "Password update complete" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

function randomValueHex (len) {
  return crypto.randomBytes(Math.ceil(len/2))
      .toString('hex')
      .slice(0,len)
}

module.exports = router;
