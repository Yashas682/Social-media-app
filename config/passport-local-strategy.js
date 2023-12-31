const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// import user
const User = require('../models/user');

// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true,
    },
    async function(req, email, password, done){
        try{
            // find a user and establish the identity
        const user = await User.findOne({email: email},)
           
            // if(err){
            //     req.flash('error', error);
            //     return done(error);
            // }

            if(!user || user.password != password){
                req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }

            return done(null, user);
        
        }catch (error) {
            console.log("Error in signing account:", error);
            // return res.end("Error in signing account");
         }
    }

));


// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});


// deserializing the user from the key in the cookies
passport.deserializeUser(async function(id, done){
   try{ 
    const user = await User.findById(id)
        
        return done(null, user);
    }catch (error) {
        console.log("Error in signing account:", error);
        // return res.end("Error in signing account");
     }

});


// check if the user is authenticated
passport.checkAuthentication =function(req, res, next){
    // if the user is signed in, the pass on the request to the next function(controller's action)
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        // req.user contains the current signed in user for the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user
    }
    next();
}


module.exports = passport;