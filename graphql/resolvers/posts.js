const { AuthenticationError } = require('apollo-server-errors')
const Post = require('../../models/Post')
const checkAuth = require('../../utils/checkAuth')

module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({createdAt:1}) //latest post at top of array
        return posts
      } catch (e) {
        console.log("ERROR", e)
        throw new Error(e)
      } 
    },
    getPost: async (parent, {postId}, context, info) => {
      try {
        const post = await Post.findById(postId)

        if (post) {
          return post
        } else {
          throw new Error("Post not found")
        }
      } catch(err) {
        throw new Error(err)
      }
    },
  },
  Mutation: {
    createPost: async (parent, {body}, context, info) => {
      const user = checkAuth(context)

      console.log("OOZER", user)

      if (body.trim() === "") {
        throw new Error("Post cannot be empty")
      }

      const newPost = new Post({
        body,
        username: user.username,
        user: user.id,
        createdAt: new Date().toISOString()
      })

      const post = await newPost.save()

      context.pubSub.publish("NEW_POST", {
        newPost: post
      })

      return post
    },
    deletePost: async (parent, {postId}, context, info) => {
      const user = checkAuth(context)
      try{
        const post = await Post.findById(postId)
        if (user.username === post.username) {
          await post.delete()
          return "Post deleted Successfully"
        } else {
          throw new AuthenticationError("This is not your post. Action not allowed.")
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    likePost: async (parent, {postId}, context, info) => {
      const user = checkAuth(context)
      try {
        const post = await Post.findById(postId)
        if (post) {
          //overall logic: if post is already liked by current user, then unlike it
          //else like it.
          //yes, some basic code is repeated and can be made simpler
          if (post.likes.find(like => like.username === user.username)) {
            let likeIndex = post.likes.findIndex(like => like.username === user.username) //could do filter instead here
            post.likes.splice(likeIndex, 1)
            await post.save()
            return post
          }
          post.likes.push({
            username: user.username,
            createdAt: new Date().toISOString()
          })
          await post.save()
          return post
        } else {
          throw new UserInputError("Post does not exist.")
        }

      } catch (err) {
        throw new Error(err)
      }
    }
  },
  Subscription: {
    newPost: {
      subscribe: (parent, args, context, info) => context.pubSub.asyncIterator("NEW_POST")
    }
  }
}