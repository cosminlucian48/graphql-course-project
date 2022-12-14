const User = require('../models/User');
const Post = require('../models/Post');
// const Comment = require('../models/Comment');
const { ApolloError } = require('apollo-server-errors');
const bcrypt = require("bcryptjs");
const { checkIfUserLoggedIn } = require('../utils/auth');

module.exports.createComment = async (args, context) => {
    const user = checkIfUserLoggedIn(context);
    if (!user) return;

    const { postId, body } = args;
    if (body.trim() === '') {
        throw new ApolloError("Empty comments are not allowed", "EMPTY_COMMENT");
    }
    try {
        const post = await Post.findById(postId);

        post.comments.unshift({
            body,
            email: user.email,
            createdAt: new Date().toISOString()
        });
        await post.save();
        return post;
    } catch (err) {
        throw new ApolloError("Post not found!", "POST_NOT_FOUND");
    }
}

module.exports.deleteComment = async (args, context) => {
    const user = checkIfUserLoggedIn(context);
    if (!user) return;

    const { postId, commentId } = args;

    try {
        const post = await Post.findById(postId).populate('author');
        const commentIndex = post.comments.findIndex(c => c.id ===commentId);
        if(commentIndex==-1){
            throw "COMMENT_NOT_FOUND";    
        }
        //only if you are the author of the post, the comment or you are an ADMIN
        if (post.author._id!=user.user_id && user.role!=1 && post.comments[commentIndex].email!=user.email) throw "DELETE_NOT_ALLOWED";
        post.comments.splice(commentIndex,1);
        await post.save();
        return post;

    } catch (err) {
        if (err == "COMMENT_NOT_FOUND"){
            throw new ApolloError("Comment not found!", "COMMENT_NOT_FOUND");    
        }else if (err="DELETE_NOT_ALLOWED"){
            throw new ApolloError("You are not allowed to delete this comment.", "DELETE_NOT_ALLOWED");
        }
        throw new ApolloError("Post not found!", "POST_NOT_FOUND");
    }

}