const Post = require('../models/post');
const Comment = require('../models/comment')
const Like = require('../models/like');

module.exports.create = async (req, res)=>{
    try {
      let post = await Post.create({
        content: req.body.content,
        //this  req.user._id is usable because of passport js from setAuthenticatedUser function , you can check it , go to passport-local-strategy
        user: req.user._id
        // why only user id because id is unique for each user in DB
        });

        if (req.xhr){
          // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
          // post = await post.populate('user', 'name').execPopulate();
          return res.status(200).json({
            data: {
              post: post
            },
            message: "Post created!"
          });
        }

        req.flash('success', 'Post published');
        return res.redirect('back');
    } catch (err) {   
      req.flash('success', err);
       // added this to view the error on console as well
      console.log(err);
      return res.redirect('back');
    }
    }


// module.exports.destroy = async (req, res) => {
//       try {
//         // Check if the post exists
//         let post = await Post.findOneAndDelete({ _id: req.params.id });
    
//         if (!post) {
//           console.log("Post not found");
//           return res.status(404).send("Post not found");
//         }
    
//         // Check if the current user is the owner of the post
//         // .id means converting the object id into string
//         if (post.user.toString() !== req.user.id) {
//           post.remove();
//           console.log("User is not the owner of the post");
//           return res.status(401).send("Unauthorized");
//         }
    
//         // Delete the post's associated comments
//         await Comment.deleteMany({ post: req.params.id });


//         if (req.xhr){
//           return res.status(200).json({
//             data: {
//               post_id: req.params.id
//             },
//             message:"Post deleted"
//           });
//         }


//         req.flash('success', 'Post and associated comments deleted');

//         return res.redirect("back");
        
//       } catch (error) {
//         console.log('Error');
//         return res.redirect("back");
//       }
//     };
// 


// module.exports.destroy = async function (req, res) {
//   try {
//       let post = await Post.findById(req.params.id);

//       console.log(typeof post);
//       if (post.user == req.user.id) {

//           // await Like.deleteMany({ likeable: post._id, onMondel: 'Post' });
//           // await Like.deleteMany({ _id: { $in: post.Comment } });
//           post.remove();
//           await Comment.deleteMany({ post: req.params.id });
//           if (req.xhr) {
//               return res.status(200).json({
//                   data: {
//                       post: req.params.id
//                   },
//                   message: 'post deleted'
//               });
//           }
//           req.flash('success', 'post and associated comment is deleted');
//           return res.redirect('back');
//       } else {
//           return res.redirect('back');
//       }
//     }
//       catch (err) {
//         req.flash('error', err.message); // Use err.message instead of err
//           return res.redirect('back');
//       }}



module.exports.destroy = async (req, res) => {
  try {
    // Check if the post exists
    let post = await Post.findOne({ _id: req.params.id });

    if (!post) {
      console.log("Post not found");
      return res.status(404).send("Post not found");
    }

    // Check if the current user is the owner of the post
    if (post.user.toString() !== req.user._id.toString()) {
      console.log("User is not the owner of the post");
      return res.status(401).send("Unauthorized");
    }

    // delete the associated likes for the post and all its comments' likes too
    await Like.deleteMany({likeable: post, onModel: 'Post'});
    await Like.deleteMany({_id: {$in: post.comments}});


    // Delete the post's associated comments
    await Comment.deleteMany({ post: req.params.id });

    // Remove the post
    await post.deleteOne();

    if (req.xhr) {
      return res.status(200).json({
        data: {
          post_id: req.params.id,
        },
        message: "Post deleted",
      });
    }

    req.flash("success", "Post and associated comments deleted");

    return res.redirect("back");
  } catch (error) {
    console.log("Error:", error);
    req.flash("error", error.message);
    return res.redirect("back");
  }
};