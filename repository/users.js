const { ApolloError } = require('apollo-server-express');
const bcrypt = require("bcryptjs");

const User = require('../models/User');
const Interest = require('../models/Interest');
const { checkIfUserLoggedIn } = require('../utils/auth');
const { validateRegisterInput } = require('../utils/validators');
const { APQ_CACHE_PREFIX } = require('apollo-server-core/dist/requestPipeline');

module.exports.registerHandler = async (args) => {
    if (!validateRegisterInput(args)) return;
    const { firstName, lastName, email, password } = args;

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

module.exports.getUserById = async (args, context) => {
    if (!checkIfUserLoggedIn(context)) return;

    const { ID } = args;
    return await User.findById(ID).populate('interests');
}

module.exports.deleteUserById = async (args, context) => {
    if (!checkIfUserLoggedIn(context)) return;

    const { ID } = args;
    const res = await User.deleteOne({ _id: ID });  // return 3 fields, last beeing deleteCount
    const wasDeleted = res.deletedCount;
    return wasDeleted;
}

module.exports.editUserById = async (args, context) => {
    if (!checkIfUserLoggedIn(context)) return;

    const { ID, userInput: { firstName, lastName, email, password } } = args;
    const res = await User.updateOne({ _id: ID }, {
        lastName: lastName,
        firstName: firstName,
        email: email,
        password: password
    });
    const wasUpdated = res.modifiedCount;
    return wasUpdated;
}

module.exports.getAllUsers = async (context) => {
    if (!checkIfUserLoggedIn(context)) return;
    return await User.find().populate('interests');
}

module.exports.addInterestToUser = async (args, context) => {
    const contextUser = checkIfUserLoggedIn(context);
    if (!contextUser) return;
    const { interestId } = args;
    // console.log({ interestId });
    const user = await User.findById(contextUser.user_id).populate('interests');
    const interest = await Interest.findById(interestId);

    // console.log({ interest });

    const checkIfInterestExists = user.interests.filter(interest => interest._id == interestId);
    // console.log({ checkIfInterestExists });
    if (checkIfInterestExists.length > 0) {
        throw new ApolloError("User already interested", "USER_INTERESTED");
    }
    user.interests.push(interest);

    const res = await user.save();
    // console.log({ res });

    return res;
}

module.exports.getLoggedUser = async (_, context) => {
    const contextUser = checkIfUserLoggedIn(context);
    if (!contextUser) return;
    const loggedUser = await User.findById(contextUser.user_id).populate(['interests','posts']);
    // await loggedUser.posts.populate('author');

    return loggedUser;
}

module.exports.deleteUserInterestById = async (args, context) => {
    const contextUser = checkIfUserLoggedIn(context);
    if (!contextUser) return;
    const loggedUser = await User.findById(contextUser.user_id).populate('interests');
    const {interestId} = args;
    const interestsCounter = loggedUser.interests.length;
    // console.log({interestsCounter});
    loggedUser.interests = loggedUser.interests.filter(interest => interest.id !== interestId);
    
    await loggedUser.save();
    return loggedUser;
}
