const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {UserInputError} = require("apollo-server")

const {SECRET_KEY} = require("../../config")
const User = require("../../models/User")
const {registerValidator, loginValidator} = require('../../utils/validators')


const getToken = (user) => {
  return jwt.sign({
    id: user._id,
    email: user.email,
    username: user.username
  }, SECRET_KEY, {expiresIn: "1h"})
}

module.exports = {
  Mutation: {
    register: async(parent, {registerInput: {username, email, password, confirmPassword}}, context, info) => {
      //validate form data
      //make sure user doesn't already exist
      //hash password and create auth token

      const {errors, valid} = registerValidator(username, email, password, confirmPassword)

      if (!valid) {
        throw new UserInputError ("Errors", {errors})
      }

      const user = await User.findOne({username})

      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "Username is taken"
          }
        })
      }


      password = await bcrypt.hash(password, 12)

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      })

      const response = await newUser.save()

      const token = getToken(response)

      return {
        ...response._doc,
        id: response._id,
        token
      }

    },
    login: async (parent, {username, password}, context, info) => {
      const {valid, errors} = loginValidator(username, password)

      if (!valid) {
        throw new UserInputError("Errors", {errors})
      }

      const user = await User.findOne({username})

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password)

      if (!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }

      const token = getToken(user)

      return {
        ...user._doc,
        id: user._id,
        token
      }
    }
  }
}