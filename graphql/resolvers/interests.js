const Interest = require('../../models/Interest');
const { checkIfUserLoggedIn } = require('../../utils/auth');

module.exports = {
    Query: {
        async getInterestById(_, { ID }) { //parent, args,
            return await Interest.findById(ID);
        },
        async getAllInterests(_, args, context) {
            return await Interest.find();
        }
    },
    Mutation: {
        async createInterest(_, args, context) {
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
                newInterest = new Interest({
                    title,
                    game_genre,
                    game_type,
                    game_paltform
                });
            }else if(movie_genre){
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
    }
}