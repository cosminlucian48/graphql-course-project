const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    body: String,
    email: String,
    createdAt: String, 
    comments: [
        {
            body: String,
            email: String,
            createdAt: String
        }
    ],
    likes: [
        {
            email: String, 
            createdAt: String
        }
    ],
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Post', postSchema);




// MONGODB doesnt have a schema/ relations 
// but the ORM lets us have relations 