var nodemailer = require("nodemailer");

const sendEmail = (email, subject, body) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "belloolakunledavid@gmail.com",
      pass: "qvvhxetvpidpdqdc",
    },
  });

  var mailOptions = {
    from: "belloolakunledavid@gmail.com",
    to: email,
    subject: subject,
    html: body,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendEmail };
