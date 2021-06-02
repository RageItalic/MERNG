const Post = require("../../models/Post")
const checkAuth = require("../../utils/checkAuth")
const {AuthenticationError, UserInputError} = require("apollo-server")


module.exports = {
  Mutation: {
    createComment: async (parent, {postId, body}, context, info) => {
      try {
        //probably check authentication
        const user = checkAuth(context)
        if (body.trim() === "") {
          throw new UserInputError("Comment cannot be empty", {
            errors: {
              body: "comment can't be empty"
            }
          })
        }

        const post = await Post.findById(postId)
        if (post) {        
          const comment = {
            body,
            username: user.username,
            createdAt: new Date().toISOString()
          }

          post.comments.unshift(comment)
          await post.save()
          return post
        } else {
          throw new UserInputError("Post does not exist.")
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    deleteComment: async (parent, {postId, commentId}, context, info) => {
      try {
        const user = checkAuth(context)
        const post = await Post.findById(postId)
        if (post) {
          const commentIndex = post.comments.findIndex(comment => comment.id === commentId)
          const comment = post.comments[commentIndex]
          if (user.username === comment.username) {
            //delete post[commentIndex]
            console.log("deletion in progress")
            post.comments.splice(commentIndex, 1)
            await post.save()
            //await post.delete()
            
            return post //"Comment deleted Successfully"
          } else {
            throw new AuthenticationError("This is not your comment. Action not allowed.")
          }
        } else {
          throw new UserInputError("Post does not exist")
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  }
}