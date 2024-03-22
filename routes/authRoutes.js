
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken");
const User = require("../db/userModel");

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

// Utilities for email sending
const util = require("../utilities/util");

router.post("/forgot-password", async (request, response) => {
  const {email } = request.body;
  const user = await User.findOne({ email });

  if (!user) {
    return response.status(404).send({
      message: "Email not found",
      error,
    });
  }

  const passwordResetToken = util.randomValueHex(25);
  user.passwordResetToken = passwordResetToken;
  user.save();

  util.sendEmail(email, "Password reset request", `Hello ${user.lastname},<br /><br />You have requested a password reset. Please follow the link below to reset your password.<br /><a href='https://adjay-gas.vercel.app/reset-password?userId=${user._id}&t=${passwordResetToken}'>https://adjay-gas.vercel.app/reset-password?userId=${user._id}&t=${passwordResetToken}</a>`);

    response.status(201).json({ message: "Password reset initiated successfully. Please check your email to continue" });
})

module.exports = router;