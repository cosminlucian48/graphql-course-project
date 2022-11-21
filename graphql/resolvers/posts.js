const { getAllPosts, getPostById, deletePostById, createPost, createLike } = require('../../repository/posts.js');
const {PubSub} = require('graphql-subscriptions');

const pubsub = new PubSub();

module.exports = {
    Query: {
        async getAllPosts(_, args, context) {
            return getAllPosts(context);
        },
        async getPostById(_, args, context) {

            return getPostById(args, context);
        },

    },
    Mutation: {
        async deletePostById(_, args, context) {
            return deletePostById(args, context);
        },
        async createPost(_, args, context) {
            context.pubsub = pubsub;
            return createPost(args, context);
        },
        async likePost(_, args, context) {
            return createLike(args, context);
        }
    },
    Subscription: {
        newPost: {
            subscribe() { 
                const asyncIterator = pubsub.asyncIterator('NEW_POST');
                return asyncIterator;
            }
        }
    }
}