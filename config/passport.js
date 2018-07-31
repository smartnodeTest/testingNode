// Importing Passport, strategies, and config

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const FacebookTokenStrategy = require('passport-facebook-token');  
const mongoose = require('mongoose');

const User = require('../models/user');

const ModelUser = require('../models/user.model');
const config = require('./config');


// Setting username field to email rather than username
const localOptions = {
  usernameField: 'email'
};

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  ModelUser.findOne({ email }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { status: 'PASSWORD MISMATCH' }); }

    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false, { status: 'PASSWORD MISMATCH' }); }

      return done(null, user);
    });
  });
});


 const fbLogin = new FacebookTokenStrategy({
    clientID: '2086742031647611',
    clientSecret: 'bf03a61ab12cc9ea20cb550605c5c85a'
  }, function(accessToken, refreshToken, profile, done) {
  
    console.log("profile : ", profile);
  	console.log("accessToken : ",accessToken);
  	console.log("refreshToken : ",refreshToken);
  	
  	
  	
  	
  	ModelUser.findOne({$and : [ { provider : 'FACEBOOK'}, {faceBookId : profile.id} ]}, (err, existingUser) => {
    if (err) { return next(err); }

      // If user is not unique, return error
    if (existingUser) {
    		console.log("Registration UnSuccessful and returning !!!!");
        //     res.status(201).json({
// 				status: 'SUCCESS'
//       		});

   		return done(err, existingUser);
    } else {
			console.log("Creating New FB User !!!!");
      // If email is unique and password was provided, create account
    	const user = new ModelUser({
            _id: new  mongoose.Types.ObjectId(),
            email: profile._json.email,
            firstName: profile._json.first_name,
            lastName : profile._json.last_name,
            faceBookId : profile._json.id,
            provider : "FACEBOOK"
    	});

    user.save((err, user) => {
      if (err) { return done(err, null); }

        // Subscribe member to Mailchimp list
        // mailchimp.subscribeToNewsletter(user.email);

        // Respond with JWT if user was created

    //   res.status(201).json({
// 		status: 'SUCCESS'
//       });

   		return done(err, user);

    });
	}
      

  });
  
  }
);

// Setting JWT strategy options
const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  
  //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
  //jwtFromRequest: ExtractJwt.fromBodyPrivate(),
  
    secretOrKey: config.jwt.secret
  // TO-DO: Add issuer and audience checks
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {

console.log("Auth Started !! ");
console.log(ExtractJwt.fromAuthHeaderWithScheme("Mobile"));
var myObjectId = mongoose.Types.ObjectId(payload._id); 

  ModelUser.findById(myObjectId, (err, user) => {
    if (err) { return done(err, false); }
    if (user) {
      console.log("User Found !!")
      done(null, user);
    } else {
      done(null, false);
    }
  });
});



passport.use(jwtLogin);
passport.use(localLogin);
passport.use(fbLogin);
