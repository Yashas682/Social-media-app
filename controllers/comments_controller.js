const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
const Like = require('../models/like');


// const commentEmailWorker = require('../workers/comment_email_worker');


// module.exports.create = async function(req, res){

//   try{
//       let post = await Post.findById(req.body.post);

//       if (post){
//           let comment = await Comment.create({
//               content: req.body.content,
//               post: req.body.post,
//               user: req.user._id
//           });

//           post.comments.push(comment);
//           post.save();
          
//           comment = await comment.populate('user', 'name email').execPopulate();
//           commentsMailer.newComment(comment);
//           if (req.xhr){
              
  
//               return res.status(200).json({
//                   data: {
//                       comment: comment
//                   },
//                   message: "Post created!"
//               });
//           }


//           req.flash('success', 'Comment published!');

//           res.redirect('/');
//       }
//   }catch(err){
//       req.flash('error', err);
//       return;
//   }
  
// }








module.exports.create = async (req, res) => {
    try {
      //  1: find post with that post id first
      //  2: create a comment after it
      //   because we need to create a comment , alot it with the post and inside the post schema  we also add the comment id to the array we just created there
      // let userPost = await Post.findById(req.body)
      let post = await Post.findById(req.body.post);
      if (post) {
        let comment = await Comment.create({
          content: req.body.content,
          post: req.body.post,
          user: req.user._id,
        });
  
        post.comments.push(comment);
        post.save();

        comment = await Comment.findById(comment._id).populate("user");
        // commentsMailer.newComment(comment);
        let job = queue.create('emails', comment).save(function(err){
            if (err){
              console.log('error in sending to the queue', err);
              return;
            }
            console.log('job enqueued', job.id);
        });
        // if error remove
        if (req.xhr){
                
    
          return res.status(200).json({
              data: {
                  comment: comment
              },
              message: "Post created!"
          });
      }


        req.flash('success', 'Comment published!');
      }
      
      return res.redirect("/");
    } catch (error) {
      req.flash("Error: ", error);
      return;
    }
  };


// deleting comment

module.exports.destroy = async (req, res) => {
  try {
    // Check if the comment exists
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      console.log("Comment not found");
      return res.status(404).send("Comment not found");
    }

    // Check if the current user is the owner of the comment
    if (comment.user.toString() !== req.user.id) {
      console.log("User is not the owner of the comment :(");
      return res.status(401).send("Unauthorized");
    }

    // Save the post ID before deleting the comment
    const postId = comment.post;

    // Delete the comment
    await comment.remove();

    // Remove the comment ID from the post's `comments` array
    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: req.params.id },
    });
    // req.flash('success', 'Comment deleted!');
    // CHANGE :: destroy the associated likes for this comment
    await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
    
     // send the comment id which was deleted back to the views
     if (req.xhr){
      return res.status(200).json({
          data: {
              comment_id: req.params.id
          },
          message: "Post deleted"
      });
  }

  req.flash('success', 'Comment deleted!');

  res.redirect("back");
    
    
  } catch (err) {
    // console.log("Error deleting comment:", err.message);
      req.flash('error', 'Comment Deleted.');
      // req.flash('error', err);
    return res.redirect("back");
  }
};