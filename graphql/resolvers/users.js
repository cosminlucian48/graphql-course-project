const User = require('../../models/User');
const { loginHandler } = require('../../repository/login');
const { searchUserInteraction, registerHandler, deleteUserById, editUserById, getAllUsers, addInterestToUser, getUserById, getLoggedUser, deleteUserInterestById } = require('../../repository/users.js');

module.exports = {
    Query: {
        async getUserById(_, args, context) { //parent, args,
            return getUserById(args, context);
        },
        async getAllUsers(_, args, context) {
            return getAllUsers(context);
        },
        async getLoggedUser(_, args, context) {
            return getLoggedUser(args, context);
        }
    },
    Mutation: {
        async registerUser(_, args) {
            return registerHandler(args.registerInput);
        },
        async deleteUserById(_, args, context) {
            return deleteUserById(args, context);

        },
        async editUserById(_, args, context) {
            return editUserById(args, context);
        },
        async loginUser(_, args) {
            const token = loginHandler(args.loginInput);
            return token;
        },
        async addInterestToUser(_, args, context) {
            return addInterestToUser(args, context);
        },
        async deleteUserInterestById(_, args, context) {
            return deleteUserInterestById(args, context);
        }
    }
}