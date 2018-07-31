const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ModelUser = require('../models/user.model');
//const mailgun = require('../config/mailgun');
// const mailchimp = require('../config/mailchimp');
const config = require('../config/config');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



// Generate JWT
// TO-DO Add issuer and audience
function generateToken(user) {
  return jwt.sign({_id: user}, config.jwt.secret, {
    expiresIn: 604800 // in seconds
  });
}

//= =======================================
// Login Route
//= =======================================


exports.login = function (req, res, next) {
    
	console.log("Login Successful and Returning Back !!!!")

  res.status(200).json({
  //  token: `JWT ${generateToken(tokenToGenerate)}`,
    token: generateToken(req.user._id),
    status: 'SUCCESS',
    user : req.user
  });
};


//= =======================================
// Registration Route
//= =======================================
exports.register = function (req, res, next) {
  // Check for registration errors

  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  
    // Return error if no email provided
  if (!email || !firstName || !password) {
    return res.status(422).send({ error: 'Fields are empty.' });
  }
    
  ModelUser.findOne({email : email }, (err, existingUser) => {
    if (err) { return next(err); }

      // If user is not unique, return error
    if (existingUser) {
    		console.log("Registration UnSuccessful and returning !!!!");
      return res.status(422).send({ status: 'EXISTING USER' });
    }
  
     bcrypt.hash(req.body.password, 10, function(err, hash){
      if(err) {
      			console.log("Registration Error and returning !!!!");
         return res.status(500).json({
            error: err,
            status: 'FAIL'
         });
      }
      else {
			console.log("Registration Successful and returning !!!!");
      // If email is unique and password was provided, create account
         const user = new ModelUser({
            _id: new  mongoose.Types.ObjectId(),
            email: email,
            password: hash,
            firstName: firstName,
            lastName : lastName,
            provider : "EMAIL"
         });

    user.save((err, user) => {
      if (err) { return next(err); }

        // Subscribe member to Mailchimp list
        // mailchimp.subscribeToNewsletter(user.email);

        // Respond with JWT if user was created

      res.status(201).json({
		status: 'SUCCESS'
      });
    });

      }
   });

  });
};

//= =======================================
// Authorization Middleware
//= =======================================

// Role authorization check
// exports.roleAuthorization = function (requiredRole) {
//   return function (req, res, next) {
//     const user = req.user;
// 
//     User.findById(user._id, (err, foundUser) => {
//       if (err) {
//         res.status(422).json({ error: 'No user was found.' });
//         return next(err);
//       }
// 
//       // If user is found, check role.
//       if (getRole(foundUser.role) >= getRole(requiredRole)) {
//         return next();
//       }
// 
//       return res.status(401).json({ error: 'You are not authorized to view this content.' });
//     });
//   };
// };

//= =======================================
// Forgot Password Route
//= =======================================

// exports.forgotPassword = function (req, res, next) {
//   const email = req.body.email;
// 
//   User.findOne({ email }, (err, existingUser) => {
//     // If user is not found, return error
//     if (err || existingUser == null) {
//       res.status(422).json({ error: 'Your request could not be processed as entered. Please try again.' });
//       return next(err);
//     }
// 
//       // If user is found, generate and save resetToken
// 
//       // Generate a token with Crypto
//     crypto.randomBytes(48, (err, buffer) => {
//       const resetToken = buffer.toString('hex');
//       if (err) { return next(err); }
// 
//       existingUser.resetPasswordToken = resetToken;
//       existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour
// 
//       existingUser.save((err) => {
//           // If error in saving token, return it
//         if (err) { return next(err); }
// 
//         const message = {
//           subject: 'Reset Password',
//           text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//             'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//             'http://'}${req.headers.host}/reset-password/${resetToken}\n\n` +
//             `If you did not request this, please ignore this email and your password will remain unchanged.\n`
//         };
// 
//           // Otherwise, send user email via Mailgun
//         mailgun.sendEmail(existingUser.email, message);
// 
//         return res.status(200).json({ message: 'Please check your email for the link to reset your password.' });
//       });
//     });
//   });
// };

//= =======================================
// Reset Password Route
//= =======================================

// exports.verifyToken = function (req, res, next) {
//   User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, resetUser) => {
//     // If query returned no results, token expired or was invalid. Return error.
//     if (!resetUser) {
//       res.status(422).json({ error: 'Your token has expired. Please attempt to reset your password again.' });
//     }
// 
//       // Otherwise, save new password and clear resetToken from database
//     resetUser.password = req.body.password;
//     resetUser.resetPasswordToken = undefined;
//     resetUser.resetPasswordExpires = undefined;
// 
//     resetUser.save((err) => {
//       if (err) { return next(err); }
// 
//         // If password change saved successfully, alert user via email
//       const message = {
//         subject: 'Password Changed',
//         text: 'You are receiving this email because you changed your password. \n\n' +
//           'If you did not request this change, please contact us immediately.'
//       };
// 
//         // Otherwise, send user email confirmation of password change via Mailgun
//       mailgun.sendEmail(resetUser.email, message);
// 
//       return res.status(200).json({ message: 'Password changed successfully. Please login with your new password.' });
//     });
//   });
// };
