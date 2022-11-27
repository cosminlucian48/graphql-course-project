const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
    title: String,
    sport_type: String,
    number_of_players: Number,
    game_genre: String, 
    game_type:{
        type: String,
        enum: ["singleplayer", "multiplayer"]
    },
    game_platform: {
        type: String,
        enum: ["PC", "PlayStation", "XBox", "Nintendo"]
    },
    movie_genre: String,
    age: Number,
    movie_platform: {
        type:String,
        enum: ["Netflix","HBOMax", "Disney+", "Hulu", "Amazon"]
    } 
});

module.exports = mongoose.model('Interest', interestSchema);