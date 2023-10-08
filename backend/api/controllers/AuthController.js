/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const crypto = require('crypto');
const { validateEmail } = require('../utils');
const nodemailer = require('nodemailer');

module.exports = {
  /**
   * Retrieves an API key for a user based on their email.
   *
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @return {Promise} a Promise that resolves to the API key
   */
  getApiKey: async (req, res) => {
    try {
      const email = req.body.email;

      if (!email) {
        return res.badRequest({ message: 'Email is required' });
      }

      const alreadyExists = await User.findOne({ email: email });

      if (alreadyExists) {
        return res.badRequest({ message: 'API Key already generated' });
      }
      const { valid, reason, message } = await validateEmail(email);

      if (valid === false || reason) {
        return res.badRequest({ message: message, reason: reason });
      }

      const apiKey = crypto.randomBytes(32).toString('hex');

      await User.create({
        email: email,
        apiKey: apiKey,
      }).fetch();
      return res.status(200).json({
        apiKey: apiKey,
      });
    } catch (error) {
      console.log(error);
      return res.serverError(error);
    }
  },

  /**
   * Sends an email containing the user's API key to the provided email address.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @return {Object} The response object with a success or error message.
   */
  forgotKey: async (req, res) => {
    try {
      const email = req.body.email;
      if (!email) {
        return res.badRequest({ message: 'Email is required' });
      }
      const alreadyExists = await User.findOne({ email: email });

      if (!alreadyExists) {
        return res.badRequest({ message: 'Email does not exist' });
      }
      const trapmail = {
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASS,
        },
      };

      const google = {
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASS,
        },
      };

      const transporter = nodemailer.createTransport(google);
      const mailOptions = {
        from: 'data-gen-x@gmail.com',
        to: email,
        subject: 'Forgot API-key Request',
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
        message: 'Api-key sent to your email',
      });
    } catch (error) {
      console.log(error);
      return res.serverError(error);
    }
  },

  /**
   * Get user data by ID and return it in a standardized format.
   * @param {object} req - The request object containing the user ID.
   * @param {object} res - The response object for returning the user data.
   */
  me: async (req, res) => {
    try {
      // Find the user data by ID
      let userData = await User.findOne({
        where: {
          id: req.id,
        },
        select: ['id', 'email', 'total'],
      });

      // Reformat the user data
      userData = {
        id: userData.id,
        email: userData.email,
        'remaining generations': userData.total,
      };

      // Return the user data in the response
      return res.ok(userData);
    } catch (error) {
      // Log and return any errors
      console.log(error);
      return res.serverError(error);
    }
  },
};
