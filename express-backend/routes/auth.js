const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { validateEmail } = require("../utils");
const nodemailer = require("nodemailer");
const User = require("../models/User"); // Assuming you have a User model
const { hasApiKey } = require("../middlewares");

// Route: /auth/getApiKey
router.post("/api-key", async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const alreadyExists = await User.findOne({ email: email });

    if (alreadyExists) {
      return res.status(400).json({ message: "API Key already generated" });
    }

    const { valid, reason, message } = await validateEmail(email);

    if (valid === false || reason) {
      return res.status(400).json({ message: message, reason: reason });
    }

    const apiKey = crypto.randomBytes(32).toString("hex");

    await User.create({
      email: email,
      apiKey: apiKey,
    });

    return res.status(200).json({
      apiKey: apiKey,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route: /auth/forgotKey
router.post("/forgot-api-key", async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const alreadyExists = await User.findOne({ email: email });

    if (!alreadyExists) {
      return res.status(400).json({ message: "Email does not exist" });
    }

    const trapmail = {
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASS,
      },
    };

    const google = {
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASS,
      },
    };

    const transporter = nodemailer.createTransport(google);
    const mailOptions = {
      from: "data-gen-x@gmail.com",
      to: email,
      subject: "Forgot API-key Request",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Forgot API-key Request</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ccc;
                  border-radius: 10px;
              }
              h2 {
                  text-align: center;
                  color: #007bff;
              }
              p {
                  margin-bottom: 10px;
              }
              .apiKey {
                  display: inline-block;
                  background-color: #f9f9f9;
                  padding: 8px 12px;
                  border: 1px solid #ccc;
                  border-radius: 5px;
                  font-family: Consolas, monospace;
                  word-break: break-all;
                  max-width: 100%;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Forgot API-key Request</h2>
              <p>Hello,</p>
              <p>You have requested your API-key to be sent to your email.</p>
              <div class="apiKey" id="apiKey">${alreadyExists.apiKey}</div>
          </div>
      </body>
      </html>        
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info.response);
      }
    });

    return res.status(200).json({
      message: "Api-key sent to your email",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route: /auth/me
router.get("/me", [hasApiKey], async (req, res) => {
  try {
    const userData = await User.findOne({
      where: {
        id: req.id,
      },
      select: ["id", "email", "total"],
    });

    const formattedUserData = {
      id: userData.id,
      email: userData.email,
      "remaining generations": userData.total,
    };

    return res.json(formattedUserData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
