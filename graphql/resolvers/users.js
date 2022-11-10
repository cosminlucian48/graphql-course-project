const User = require ('../../models/User');
const {ApolloError} = require('apollo-server-errors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {MY_SECRET_KEY} = require('../../config/jwt');

module.exports = {
    Query: {
        async getUserById(_, { ID}){ //parent, args,
            return await User.findById(ID);
        },
        async getAllUsers(_,args,context){
            if(!context.loggedUser) {
                return;
            }
            return await User.find();
        }
    },
    Mutation:{
        async registerUser(_, {registerInput: {firstName, lastName, email, password, confirmPassword}}){

            if (password!=confirmPassword) {
                throw new ApolloError("Passwords dont match.", 'PASSWORDS_DONT_MATCH');
            }

            const oldUser = await User.findOne({email});
            if (oldUser){
                throw new ApolloError("A user with this email already exists: " + email, 'USER_ALREADY_EXISTS');
            }

            var encryptedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                firstName:firstName,
                lastName:lastName,
                email:email.toLowerCase(),
                createdAt: new Date().toISOString(),
                password:encryptedPassword
            });

            const res = await newUser.save(); //Mongodb saving

            return {
                id:res._id,
                ...res._doc
            }
        },
        async deleteUser(_, {ID}){
            const res = await User.deleteOne({_id: ID});  // return 3 fields, last beeing deleteCount
            const wasDeleted = res.deletedCount;
            return wasDeleted;
        },
        async editUser(_, {ID, userInput: {firstName, lastName, email, password}}){
            const res = await User.updateOne({_id:ID},{
                lastName:lastName,
                firstName:firstName,
                email:email,
                password:password
            });
            const wasUpdated = res.modifiedCount;
            return wasUpdated;
        },
        async loginUser(_, {loginInput: {email, password}},context){
            console.log({context});
            const user= await User.findOne({email});
            if (!user) throw new ApolloError("No user with this email " + email, 'EMAIL_NOT_FOUND');
            

            const isMatch = await bcrypt.compareSync(password,user.password);
            if(!isMatch) throw new ApolloError("Wrong password for " + email, 'INCORRECT_PASSWORD');

            const token = jwt.sign(
                {
                    user_id:user._id,
                    email
                },
                MY_SECRET_KEY,
                {
                    expiresIn:"12h"
                }
            );
            return token;
        }
    }
}