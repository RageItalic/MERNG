const {gql} = require('apollo-server')

module.exports = gql`
type Post {
  id: ID!
  body: String!
  createdAt: String!
  username: String!
  comments: [Comment]!
  likes: [Like]!
  likeCount: Int!
  commentCount: Int!
}

type Comment {
  id: ID!
  body: String!
  username: String!
  createdAt: String!
  #maybe even add likes here
}

type Like {
  id: ID!
  username: String!
  createdAt: String!
}

type Query{
  getPosts: [Post]
  getPost(postId: ID!): Post 
}

type User {
  id: ID!
  username: String!
  email: String!
  token: String!
  createdAt: String!
}

input RegisterInput {
  email: String!
  username: String!
  password: String!
  confirmPassword: String!
}

type Mutation {
  register (registerInput: RegisterInput): User!
  login (username: String!, password: String!): User!
  createPost (body: String!): Post!
  deletePost (postId: ID!): String!
  createComment (body: String!, postId:String!): Post!
  deleteComment (postId: String!, commentId: ID!): Post!
  likePost (postId: ID!): Post!
}

type Subscription {
  newPost: Post!
}


`