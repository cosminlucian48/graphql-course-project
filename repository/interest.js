const Interest = require('../models/Interest');
const { ApolloError } = require('apollo-server-errors');
const { checkIfUserLoggedIn } = require('../utils/auth');
const User = require('../models/User');

module.exports.getAllInterests = async (_, context) => {
    if (!checkIfUserLoggedIn(context)) return;
    return await Interest.find();
}

module.exports.getInterestById = async (args, context) => {
    if (!checkIfUserLoggedIn(context)) return;
    const {ID} = args;
    return await Interest.findById(ID);
}

module.exports.getInterestByType = async (args, context) => {
    if (!checkIfUserLoggedIn(context)) return;
    const { type } = args;
    const interests = await Interest.find();
    console.log({ type });
    var filteredInterests;
    if (type == 'MovieInterest') {
        filteredInterests = interests.filter(
            interest => interest.movie_genre);
    } else if (type == 'GameInterest') {
        filteredInterests = interests.filter(
            interest => interest.game_type);
    } else if (type == 'SportInterest') {
        filteredInterests = interests.filter(
            interest => interest.sport_type);
    }
    console.log({ filteredInterests });
    return filteredInterests;
}

module.exports.createInterest = async (args, context) => {
    const contextUser = checkIfUserLoggedIn(context);
    if (!contextUser) return;
    const { title, sport_type, number_of_players, game_genre, game_type, game_platform, movie_genre, age, movie_platform } = args.interestInput;
    var newInterest;
    console.log({ args });
    if (sport_type) {
        newInterest = new Interest({
            title,
            sport_type,
            number_of_players
        });
    } else if (game_type) {
        if (!["singleplayer", "multiplayer"].includes(game_type)) {
            throw new ApolloError("Game type not in the system", "WRONG_GAME_TYPE");
        }
        if (!["PC", "PlayStation", "XBox", "Nintendo"].includes(game_platform)) {
            throw new ApolloError("Game platform not in the system", "WRONG_GAME_PLATFORM");
        }
        newInterest = new Interest({
            title,
            game_genre,
            game_type,
            game_platform
        });
    } else if (movie_genre) {
        if (!["Netflix", "HBOMax", "Disney+", "Hulu", "Amazon"].includes(movie_platform)) {
            throw new ApolloError("Movie platform not in the system", "WRONG_MOVIE_PLATFORM");
        }
        newInterest = new Interest({
            title,
            movie_genre,
            age,
            movie_platform
        });
    }
    console.log({ newInterest });
    const interest = await newInterest.save();
    return interest;
}

module.exports.deleteInterestById = async (args,context) =>{
    if (!checkIfUserLoggedIn(context)) return;
    const {ID} = args;
    const res = await Interest.deleteOne({ _id: ID });  // return 3 fields, last beeing deleteCount
    const wasDeleted = res.deletedCount;
    return wasDeleted;
}

module.exports.getInterestsForLoggedUser = async (args,context) =>{
    const contextUser = checkIfUserLoggedIn(context);
    if (!contextUser) return;
    const loggedUser = await User.findById(contextUser.user_id).populate('interests');
    return loggedUser.interests;
}