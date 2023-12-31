const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async(req, res)  => {
    try{
        let user = await User.findOne({email: req.body.email});
  //If user not found
        if(!user || user.password != req.body.password){
            return res.json(422, {
                message:"Invalid username or password"
            });
        }
 // If user found 
        return res.json(200, {
            message: "Sign in successful, here is your token, please keep it safe!",
            data: {
                token: jwt.sign(user.toJSON(), 'socialmedia', {expiresIn: '100000'})
            }
        })

    }catch(error){
        console.log("error ********", error);
        return res.json(500, {
          message: "Internal Server Error"
        });
    }
}