const {gql} = require ('apollo-server-express');

module.exports = gql`
type User {
    id: ID!
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

type Post{
    id: ID!
    body: String
    createdAt: String
    email: String
    comments: [Comment]!
    likes: [Like]!
}

type Comment{
    id: ID!
    createdAt: String!
    email: String!
    body: String!
}

type Like{
    id: ID!
    createdAt: String!
    email: String!
}


type Query{
    getUserById(ID: ID!): User!
    getAllUsers: [User]
    getAllPosts: [Post]
    getPostById(ID: ID!): Post!
}

type Mutation {
    registerUser(registerInput: RegisterInput): User
    deleteUserById(ID: ID!): Boolean
    editUserById(ID: ID!, userInput: UserInput): Boolean
    loginUser(loginInput: LoginInput): String
    createPost(body: String!): Post
    deletePostById(ID:ID!): Boolean
    createComment(postId: String!, body:String!): Post!
    deleteComment(postId:ID!, commentId:ID!):Post!
    likePost(ID:ID!):Post! 
}
type Subscription {
    newPost: Post!
}
`

