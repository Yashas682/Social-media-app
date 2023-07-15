const Post = require('../models/post');
const Comment = require('../models/comment')

module.exports.create = async (req, res)=>{
    try {
      let post = await Post.create({
        content: req.body.content,
        //this  req.user._id is usable because of passport js from setAuthenticatedUser function , you can check it , go to passport-local-strategy
        user: req.user._id
        // why only user id because id is unique for each user in DB
        });

        req.flash('success', 'Post published');
        return res.redirect('back');
    } catch (err) {   
      req.flash('success', err);
      return res.redirect('back');
    }
    }


module.exports.destroy = async (req, res) => {
      try {
        // Check if the post exists
        let post = await Post.findOneAndDelete({ _id: req.params.id });
    
        if (!post) {
          console.log("Post not found");
          return res.status(404).send("Post not found");
        }
    
        // Check if the current user is the owner of the post
        // .id means converting the object id into string
        if (post.user.toString() !== req.user.id) {
          console.log("User is not the owner of the post");
          return res.status(401).send("Unauthorized");
        }
    
        // Delete the post's associated comments
        await Comment.deleteMany({ post: req.params.id });

        req.flash('success', 'Post and associated comments deleted');

        return res.redirect("back");
        
      } catch (error) {
        console.log('Error', err);
        return res.redirect("back");
      }
    };