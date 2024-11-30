// Package imports
const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();  // Correct import

const app = express();

// Config
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || "localhost";

// Express settings
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Contact form settings
const SERVICE = "gmail"; // Supported service (e.g., Gmail)
const SMTP_HOST = process.env.SMTP_HOST; // Custom SMTP host (optional)
const SMTP_USER = process.env.SMTP_USER || "your-email-for-use@gmail.com";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "your-email-app-password";
const RECIVER = process.env.RECIVER || "contact@yourdomain.com"; // Corrected syntax

// SMTP Transporter
let transporter;
if (SERVICE === "gmail") {
  transporter = nodemailer.createTransport({
    service: SERVICE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });
} else if (SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });
}

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/contactus", (req, res) => {
  res.status(404).send("Sorry, you hit the wrong route.");
});

app.post("/contactus", (req, res) => {
  if (!req.body.email || !req.body.uname || !req.body.body) {
    return res.status(400).send("All fields are required.");
  }

  const mailOptions = {
    from: req.body.email,
    to: RECIVER,
    subject: `New Contact Info Received From: ${req.body.uname} (${req.body.email})`,
    text: `From: ${req.body.uname} (${req.body.email})\nMessage: ${req.body.body}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("There was an error sending your message. Please try again later.");
    } else {
      console.log("Email sent:", info.response);
      res.send("Thanks for contacting us! We will respond to your email as soon as possible.");
    }
  });
});

// Listen
app.listen(PORT, HOSTNAME, () => {
  console.log(`App started at http://${HOSTNAME}:${PORT}`);
});
