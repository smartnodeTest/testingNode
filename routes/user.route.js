const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ModelUser = require('../models/user.model');
var config = require('../config/config');

router.post('/signup', function(req, res) {
   console.log(req.body);
   bcrypt.hash(req.body.password, 10, function(err, hash){
      if(err) {
         return res.status(500).json({
            error: err,
            success: 'FAIL'
         });
      }
      else {
         const user = new ModelUser({
            _id: new  mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
            name: req.body.name     
         });
         user.save().then(function(result) {
            console.log(result);
            res.status(200).json({
               success: 'SUCCESS'
            });
         }).catch(error => {
            res.status(500).json({
            	error: err,
               success: 'FAIL'
            });
         });
      }
   });
});

router.post('/signin', function(req, res){

console.log("Accpeted")
console.log(req.body)

   ModelUser.findOne({email: req.body.email})
   .exec()
   .then(function(user) {
      bcrypt.compare(req.body.password, user.password, function(err, result){
         if(err) {
            return res.status(401).json({
               status: 'PASSWORD MISMATCH'
            });
         }
         if(result) {
            const JWTToken = jwt.sign({
               _id: user._id
            },
            config.jwt.secret,
               {
                  expiresIn: '2h'
               });
            return res.status(200).json({
               status: 'SUCCESS',
               token: JWTToken,
               name: user.name
            });
         }
         return res.status(401).json({
            status: 'PASSWORD MISMATCH'
         });
      });
   })
   .catch(error => {
      res.status(500).json({
         status: 'NO ID PRESENT'
      });
   });;
});

module.exports = router;