const {MY_SECRET_KEY} = require('../config/jwt');
const jwt = require('jsonwebtoken');
const {AuthenticationError} = require('apollo-server');
module.exports.getUserFromToken = (token) => {
    try{
        return jwt.verify(token.replace('Bearer ', ''), MY_SECRET_KEY);
    }catch(err){
        return null;
    }
}