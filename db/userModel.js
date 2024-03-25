const mongoose = require("mongoose");

// Schema Definition
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an Email!"],
        unique: [true, "Email Exist"],
      },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        unique: false,
      },
    lastname: String,
    othername: String,
    phone: String,
    dob: String,
    gender: String,
    passwordResetToken: String,
    img: String,
    address: String,
    role: String,
  });
  
const Users = mongoose.model('Users', UserSchema);
module.exports = mongoose.model.Users || Users;