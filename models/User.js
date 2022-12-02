const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {type: String, unique: true},
    createdAt: String,
    password: String,
    interests:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interest'
    }]
});

module.exports = mongoose.model('User', userSchema);