const {gql} = require ('apollo-server');

module.exports = gql`
type User {
    firstName: String
    lastName: String
    email: String
    createdAt: String
    password: String
}

input UserInput{
    firstName: String
    lastName: String
    email: String
    password: String
}

type Query{
    getUserById(ID: ID!): User!
    getAllUsers: [User]
}

type Mutation {
    registerUser(userInput: UserInput): User!
    deleteUser(ID: ID!): Boolean
    editUser(ID: ID!, userInput: UserInput): Boolean
}
`

