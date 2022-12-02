const Interest = require('../../models/Interest');
const { checkIfUserLoggedIn } = require('../../utils/auth');
const { getAllInterests, getInterestById, getInterestByType, createInterest, deleteInterestById, getInterestsForLoggedUser } = require('../../repository/interest');

module.exports = {
    Query: {
        async getInterestById(_, args, context) {
            return getInterestById(args, context);
        },
        async getAllInterests(_, args, context) {
            return getAllInterests(args, context);
        },
        async getInterestByType(_, args, context) {
            return getInterestByType(args, context);
        },
        async getInterestsForLoggedUser(_, args, context) {
            return getInterestsForLoggedUser(args, context);
        }
    },
    Mutation: {
        async createInterest(_, args, context) {
            return createInterest(args, context);
        },
        async deleteInterestById(_, args, context) {
            return deleteInterestById(args, context);
        }
    }
}