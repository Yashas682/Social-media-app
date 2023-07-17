const User = require('../models/user');
const fs = require('fs');
const path = require('path');


module.exports.profile = async (req, res) => {
  try {
    // console.log(req.params.id);
    let user = await User.findById(req.params.id);
    return res.render("user_profile", {
      title: "User Profile",
      // header: "User Profile",
      profile_user: user,
    });
  } catch (error) {
    return res.status(500).send("Internal Server error", error);
  }
};


module.exports.Update = async (req, res) => {
  if (req.user.id == req.params.id) {
    try {
      //if i didn't put a check here so suppose if iam looge in as akash , and i go to vikas profile , so there in inspect ,
      //  i can see vikas user id and from there and can change it , which i don't want

     let user= await User.findByIdAndUpdate(req.params.id, req.body); 
     User.uploadedAvatar(req, res, function(err){
        if(err) {console.log('*****Multer Error: ', err)}

        user.name = req.body.name;
        user.email = req.body.email;

        if(req.file){

          if(user.avatar){
              fs.unlinkSync(path.join(__dirname, '..', user.avatar));
          }
          // this is saving the path of the uploaded file into the avatar field in the user
          user.avatar = User.avatarPath + '/' + req.file.filename;
        }
        user.save();
        return res.redirect("back");
     });
    //  req.flash('success', 'Updated!');
    //  return res.redirect("back");
    } catch (error) {
      //   return res.status(500).send("Iternal Server error",error)
      req.flash('error', err);
      return res.redirect("back");
    }
  } else {
    req.flash('error', 'Unauthorized!');
    return res.status(401).send("Unuthorize");
  }
};



// render the sign up page
module.exports.signUp = function(req, res){
  if(req.isAuthenticated()){
    return res.redirect('/users/profile');
  }
    return res.render('user_sign_up',{
        title: "Socialmedia / Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){
  
  if(req.isAuthenticated()){
    return res.redirect('/users/profile');
  }
    return res.render('user_sign_in',{
        title: "Socialmedia / Sign In"
    })
}

// get the sign up data
// module.exports.create = function(req, res){
//     if (req.body.password != req.body.confirm_password){
//         return res.redirect('back');
//     }

//     User.findOne({email: req.body.email}, function(err, user){
//         if(err){console.log('error in finding user in signing up'); return}

//         if (!user){
//             User.create(req.body, function(err, user){
//                 if(err){console.log('error in creating user while signing up'); return}

//                 return res.redirect('/users/sign-in');
//             })
//         }else{
//             return res.redirect('back');
//         }
//     })
// }

// get the sign up data (below code is copied from github as i got error)
module.exports.create = async (req, res) => {
    try {
      if (req.body.password != req.body.confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect("back");
      }
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        await User.create(req.body);
        return res.redirect("/users/sign-in");
      }
      return res.redirect("back");
    } catch (error) {
      req.flash('success', 'You have signed up, login to continue!');
      // return res.end("error in creating Account", error);
      return res.redirect('back');
    }
  };

// got error in below code
// sign in and create a session for the user
// get the sign in data
// module.exports.createSession = function(req, res) {
//     User.findOne({email: req.body.email}, function(err, user){
//         if(err){console.log('error in finding user in signing in');return}
//         if(user){
//             if(user.password != req.body.password){
//                 return res.redirect('back');
//             }
//             res.cookie('user_id', user.id);
//             return res.redirect('/users/profile');
//         }else{
//             return res.redirect('back');
//         }
//     })
// }
    

// used promises like await and catch so error cleared
// sign in and create a session for the user
// get the sign in data
    module.exports.createSession = async function(req, res) {
      req.flash('success','Logged in Successfully');
    // steps to authenticate 
    // find the user
        try {
          const user = await User.findOne({ email: req.body.email });
         // handle user found 
          if (user) {
             // handle password which dont match

            if (user.password !== req.body.password) {
              return res.redirect('back');
            }
              // handle session creation
            res.cookie('user_id', user.id);
            return res.redirect('/');
          } else {
            // handle user not found
            return res.redirect('/');
          }
        } catch (err) {
          console.log('error in finding user in signing in', err);
          // Handle the error in an appropriate way
        }
      }
 


module.exports.destroySession = (req, res) => {
  req.logout((err) => {
    if (err) return ;
    req.flash('success','You have Logged out!');
    // req.flash("success", "Logged out");
    return res.redirect("/");
    });
    };