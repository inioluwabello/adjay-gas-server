
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken");
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

module.exports = router;