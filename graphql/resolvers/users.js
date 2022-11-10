const User = require ('../../models/User');
const { loginHandler } = require('../../repository/login');
const { registerHandler, deleteUserById, editUserById, getAllUsers } = require('../../repository/users.js');

module.exports = {
    Query: {
        async getUserById(_, { ID}){ //parent, args,
            return await User.findById(ID);
        },
        async getAllUsers(_,args,context){
            return getAllUsers(context);
        }
    },
    Mutation:{
        async registerUser(_, args){
            return registerHandler(args.registerInput);
        },
        async deleteUserById(_, args, context){
            return deleteUserById(args,context);
            
        },
        async editUserById(_, args,context){
            return editUserById(args,context);
        },
        async loginUser(_, args){
            const token = loginHandler(args.loginInput);
            return token;
        }
    }
}