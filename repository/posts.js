const Post = require('../models/Post');
const { ApolloError } = require('apollo-server-errors');
const { checkIfUserLoggedIn } = require('../utils/auth');
const User = require('../models/User');

module.exports.getAllPosts = async (context) => {
    if (!checkIfUserLoggedIn(context)) return;
    const posts = await Post.find().populate('author');
    return posts ;
}

module.exports.getPostById = async (args, context) => {
    if (!checkIfUserLoggedIn(context)) return;
    const { ID } = args;
    const post = await Post.findById(ID).populate('author');
    return post;
}

module.exports.createPost = async (args, context) => {
    const contextUser = checkIfUserLoggedIn(context);
    if (!contextUser) return;
    const { body } = args;
    const author = await User.findById(contextUser.user_id);

    const newPost = new Post({
        body,
        email: author.email,
        createdAt: new Date().toISOString(),
        author
    });

    const post = await newPost.save();

    context.pubsub.publish('NEW_POST', {
        newPost: post
    });

    return post;

}

module.exports.deletePostById = async (args, context) => {
    if (!checkIfUserLoggedIn(context)) return;
    const { ID } = args;
    const post = await Post.findById(ID);
    //TODO: delete only certain posts
    if (!post) {
        throw new ApolloError("No post with that ID.", 'WRONG_POST_ID');
    }
    const res = await Post.deleteOne({ _id: ID });  // return 3 fields, last beeing deleteCount
    const wasDeleted = res.deletedCount;
    return wasDeleted;
    // return await Post.deleteOne(ID);
}

module.exports.createLike = async (args, context) => {
    const user = checkIfUserLoggedIn(context);
    if (!user) return;

    const { ID } = args;
    try {
        const post = await Post.findById(ID);
        if (post.likes.find((like) => like.email === user.email)) {
            //post already liked, unlike it
            post.likes = post.likes.filter(like => like.email !== user.email);
        } else {
            //not liked
            post.likes.push({
                email:user.email,
                createdAt: new Date().toISOString()
            });
        }
        const res = await post.save();
        return post;

    } catch (err) {
        throw new ApolloError("Post not found!", "POST_NOT_FOUND");
    }
}