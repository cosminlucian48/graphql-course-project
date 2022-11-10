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

input RegisterInput{
    firstName: String
    lastName: String
    email: String
    password: String
    confirmPassword: String
}

input LoginInput{
    email: String
    password: String
}

type Query{
    getUserById(ID: ID!): User!
    getAllUsers: [User]
}

type Mutation {
    registerUser(registerInput: RegisterInput): User
    deleteUserById(ID: ID!): Boolean
    editUserById(ID: ID!, userInput: UserInput): Boolean
    loginUser(loginInput: LoginInput): String
}
`

