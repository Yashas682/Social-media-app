const Post = require('../../../models/post');
const Comment = require('../../../models/comment');


module.exports.index = async function(req, res){
    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path: 'comments',
        populate:{
            path:'user'
        }
    });
    return res.json(200, {
        message:"List of posts",
        posts: posts
    })
}


module.exports.destroy = async (req, res) => {
    try {
      // Check if the post exists
      let post = await Post.findOne({ _id: req.params.id });
  
    //   if (!post) {
    //     console.log("Post not found");
    //     return res.status(404).send("Post not found");
    //   }
  
    //   // Check if the current user is the owner of the post
    //   if (post.user.toString() !== req.user._id.toString()) {
    //     console.log("User is not the owner of the post");
    //     return res.status(401).send("Unauthorized");
    //   }
  
      // Delete the post's associated comments
      await Comment.deleteMany({ post: req.params.id });
  
      // Remove the post .remove is not working so i have changed it to .deleteOne
      await post.deleteOne();
  
      
      return res.json(200, {
        message: "Post and associated comments deleted successfully!"
      });

    } catch (error) {
        console.log('********', err);
      return res.json(500, {
        message: "Internal Server Error"
      });
    }
  };