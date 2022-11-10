const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const { MONGODB } = require('../config/mongodb');
const typeDefs = require('../graphql/typeDefs');
const resolvers = require('../graphql/resolvers');
const { port } = require('../config/server');
const { getUserFromToken } = require('../utils/auth');


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({loggedUser:getUserFromToken(req.headers.authorization)})
});



mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log("MongoDB Connection Successful!!");
        return server.listen({ port });
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    });

