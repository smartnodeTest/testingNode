var FacebookTokenStrategy = require('passport-facebook-token');
var ModelUser = require('../models/user.model');
const passport = require('passport');

passport.use(new FacebookTokenStrategy({
    clientID: '2086742031647611',
    clientSecret: 'bf03a61ab12cc9ea20cb550605c5c85a'
  }, function(accessToken, refreshToken, profile, done) {
    ModelUser.findOrCreate({facebookId: profile.id}, function (error, user) {
      return done(error, user);
    });
  }
));