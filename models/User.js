const {model, Schema} = require('mongoose');

const userSchema = Schema({
    firstName: String,
    lastName: String,
    email: String,
    createdAt: String,
    password: String 
});

module.exports = model('User', userSchema);