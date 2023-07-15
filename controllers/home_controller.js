const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async(req,res)=>{
    // console.log(req.cookies);
    // res.cookie('user_id', 25);
try{
    // populate the user of each post
    let posts = await Post.find({}).populate('user')
    .populate({
        path: 'comments',
        populate:{
            path:'user'
        }
    });
    // .populate('likes')
    let user = await User.find({});
    return res.render('home',{
        title : "Socialmedia | Home",
        // header : "CodeBook",
        posts : posts,
        all_users : user
    });
} catch (err) {     
    console.log('Error', err);
    return;  
}
}

// module.exports.actionName = function(req, res){}