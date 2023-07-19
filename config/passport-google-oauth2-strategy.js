const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: "945513368380-4lvd81phrglu2rr4nvku08vrbo9klbvm.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback",
},

// function(accessToken, refreshToken, profile, done){
//     // find a user
//     User.findOne({email: profile.emails[0].value}).exec(function(err, user){
//         if (err){console.log('error in google strategy-passport', err); return;}

//         console.log(profile);

//         if(user){
//             // if found, set this user as req.user
//             return done(null, user);
//         }else{
//             // if not found, create the user and set it as req.user
//             User.create({
//                 name: profile.displayName,
//                 email: profile.emails[0].value,
//                 password: crypto.randomBytes(20).toString('hex')
//             }, function(err, user){
//                 if (err){console.log('error in creating user google strategy-passport', err); return;}

//                 return done(null, user);
//             });
//         }

//     });
// }
// ));

async function(accessToken, refreshToken, profile, done) {
    try {
      // find a user
      const user = await User.findOne({ email: profile.emails[0].value }).exec();
    //   console.log(accessToken, refreshToken);
      console.log(profile);
  
      if (user) {
        // if found, set this user as req.user
        return done(null, user);
      } else {
        // if not found, create the user and set it as req.user
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: crypto.randomBytes(20).toString('hex')
        });
        
        return done(null, newUser);
      }
    } catch (err) {
      console.log('Error in google strategy-passport:', err);
      return done(err);
    }
  }));
  

module.exports = passport;