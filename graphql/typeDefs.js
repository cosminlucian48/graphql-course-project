const { gql } = require('apollo-server-express');

module.exports = gql`
type User {
    id: ID!
    role: Int
    firstName: String
    lastName: String
    email: String
    createdAt: String
    password: String
    interests: [Interest]
    posts: [Post]
}

input UserInput{
    firstName: String
    lastName: String
    email: String
    password: String
    role: Int
}

input RegisterInput{
    firstName: String
    lastName: String
    email: String
    password: String
    confirmPassword: String
    role: Int
}

input LoginInput{
    email: String
    password: String
}

union PostInteraction = Comment | Like

type Post{
    id: ID!
    body: String
    createdAt: String
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int
    commentCount: Int
    author: User
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

interface Interest {
    id: ID
    title: String
}

type SportInterest implements Interest {
    id: ID
    title: String
    sport_type: String
    number_of_players: Int
}
type GameInterest implements Interest {
    id: ID
    title: String
    game_genre: String
    game_type:String
    game_platform: String
}

type MovieInterest implements Interest{
    id: ID
    title: String, 
    movie_genre: String, 
    age: Int,
    movie_platform: String
}

input InterestInput{
    title: String,
    sport_type: String,
    number_of_players: Int,
    game_genre: String, 
    game_type: String,
    game_platform: String,
    movie_genre: String,
    age: Int,
    movie_platform: String
}

type Query{
    getUserById(ID: ID!): User!
    getLoggedUser:User!
    getAllUsers: [User]
    getAllPosts: [Post]
    getPostById(ID: ID!): Post!
    getPostsByUser(author_email:String!): [Post]
    getInterestById(ID: ID!): Interest
    getAllInterests:[Interest]
    getInterestByType(type: String!): [Interest]
    getInterestsForLoggedUser:[Interest]
    getPostInteraction(ID: ID!): [PostInteraction]
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
    createInterest(interestInput: InterestInput): Interest
    deleteInterestById(ID:ID!): Boolean
    addInterestToUser(interestId: ID!): User
    deleteUserInterestById(interestId: ID!): User
}
type Subscription {
    newPost: Post!
}
`

