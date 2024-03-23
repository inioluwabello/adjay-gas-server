const mongoose = require("mongoose");

// Schema Definition
const NotificationSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: [true, "Please add a sender"],
        unique: false,
      },
    recipient: {
        type: String,
        required: [true, "Please add a recipient"],
        unique: false,
      },
    time: Date,
    message: {
      type: String,
      required: [true, "Please add a message"],
      unique: false,
    },
    title: {
      type: String,
      required: [true, "Please add a message title"],
      unique: false,
    },
  });
  
const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = mongoose.model.Notification || Notification;