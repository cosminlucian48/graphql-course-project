const usersResolvers = require('./users');
const postsResolvers = require('./posts');
const interestsResolvers = require('./interests');
const commentsResolvers = require('./comments');
const { ApolloError } = require('apollo-server-errors');

module.exports = {
    Interest: {
        __resolveType(obj, context, info) {
            console.log("INTEREST:", obj);
            if (obj.sport_type) {
                return 'SportInterest';
            }
            else if (obj.game_type) {
                return 'GameInterest';
            }
            else if (obj.movie_genre) {
                return 'MovieInterest';
            }
            return null;
        },
    },
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
    }, // each time a Query/Mutation/Subscription returns a post it will go through this code
    Query: {
        ...usersResolvers.Query, //spread operatoor
        ...postsResolvers.Query,
        ...commentsResolvers.Query,
        ...interestsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation,
        ...interestsResolvers.Mutation
    },
    Subscription: {
        ...postsResolvers.Subscription
    }
}