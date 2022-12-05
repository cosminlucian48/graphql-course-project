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
    }],
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }], 
    role: {
        type:Number,
        enum: [0,1]
    } 
});

module.exports = mongoose.model('User', userSchema);