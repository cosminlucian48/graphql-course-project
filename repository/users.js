const { ApolloError } = require('apollo-server-express');
const bcrypt = require("bcryptjs");

const User = require('../models/User');
const {checkIfUserLoggedIn} = require('../utils/auth');
const {validateRegisterInput} = require('../utils/validators');

module.exports.registerHandler = async (args) => {
    if(!validateRegisterInput(args)) return;
    const { firstName, lastName, email, password} = args;

    const oldUser = await User.findOne({ email });
    if (oldUser) throw new ApolloError("A user with this email already exists: " + email, 'USER_ALREADY_EXISTS');
    
    var encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        createdAt: new Date().toISOString(),
        password: encryptedPassword
    });

    const res = await newUser.save(); //Mongodb saving

    return {
        id: res._id,
        ...res._doc
    }
}

module.exports.deleteUserById = async (args, context) => {
    if(!checkIfUserLoggedIn(context)) return;
    
    const {ID} = args;
    const res = await User.deleteOne({ _id: ID });  // return 3 fields, last beeing deleteCount
    const wasDeleted = res.deletedCount;
    return wasDeleted;
}

module.exports.editUserById = async (args,context) => {
    if(!checkIfUserLoggedIn(context)) return;

    const {ID, userInput:{firstName, lastName, email, password}} = args;
    const res = await User.updateOne({_id:ID},{
        lastName:lastName,
        firstName:firstName,
        email:email,
        password:password
    });
    const wasUpdated = res.modifiedCount;
    return wasUpdated;
}

module.exports.getAllUsers = async (context) => {
    if(!checkIfUserLoggedIn(context)) return;
    return await User.find();
}