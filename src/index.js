const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const express = require('express');
const { http } = require('http');
const mongoose = require('mongoose');
const { PubSub } = require('graphql-subscriptions');

const { MONGODB } = require('../config/mongodb');
const typeDefs = require('../graphql/typeDefs');
const resolvers = require('../graphql/resolvers');
const { port } = require('../config/server');
const { getUserFromToken } = require('../utils/auth');

const app = express();
const httpServer = createServer(app);
const schema = makeExecutableSchema({ typeDefs, resolvers });
// const pubsub = new PubSub();

const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});
const serverCleanup = useServer({ schema }, wsServer);


const server = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    context: ({ req }) => ({ loggedUser: getUserFromToken(req.headers.authorization) }) //pubsub
});

server.start().then(() => {
    server.applyMiddleware({ app });
    httpServer.listen({ port }, () => {
        console.log(`Server runnig at http://localhost:${port}${server.graphqlPath}`);
    });

});


mongoose.connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let db = mongoose.connection;
db.on('error', () => {
    console.error("Error while connecting to DB");
});




app.get("/", (req, res) => {
    console.log("Apollo GraphQL Express server is ready");
});



