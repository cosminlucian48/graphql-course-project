const usersResolvers = require('./users');
const postsResolvers = require('./posts');
const commentsResolvers = require('./comments');

module.exports = {
    Post:{
        likeCount:(parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
    }, // each time a Query/Mutation/Subscription returns a post it will go through this code
    Query:{
        ...usersResolvers.Query, //spread operatoor
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation,
    },
    Subscription: {
        ...postsResolvers.Subscription
    }
}