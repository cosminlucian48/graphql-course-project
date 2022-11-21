const {MY_SECRET_KEY} = require('../config/jwt');
const jwt = require('jsonwebtoken');
const {ApolloError} = require('apollo-server-express');
module.exports.getUserFromToken = (token) => {
    try{
        return jwt.verify(token.replace('Bearer ', ''), MY_SECRET_KEY);
    }catch(err){
        return null;
    }
}

module.exports.checkIfUserLoggedIn = (context) => {
    const {loggedUser} = context;    
    if(!loggedUser){
        throw new ApolloError("User not logged id.", 'USER_NOT_LOGGED_IN');
    }
    return loggedUser;
}