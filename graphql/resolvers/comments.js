const Post = require('../../models/Post');
const { createComment,deleteComment } = require('../../repository/comments');
module.exports = {
    Mutation: {
        createComment: async (_, args, context) => {
            return createComment(args, context);
        },
        deleteComment: async (_,args,context) => {
            return deleteComment(args, context);
        }
    }
}