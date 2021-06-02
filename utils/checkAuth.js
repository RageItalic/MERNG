const { AuthenticationError } = require("apollo-server")
const jwt = require("jsonwebtoken")
const {SECRET_KEY} = require('../config')

module.exports = (context) => {
  //context = {... headers}
  console.log("Checking Authorization", context.req.headers)

  const authHeader = context.req.headers.authorization;
  console.log(authHeader)
  if (authHeader) {
    //Bearer ....
    const token = authHeader.split("Bearer ")[1]
    if (token) {
      console.log("in if")
      try {
        console.log("in if try")
        const user = jwt.verify(token, SECRET_KEY)
        return user
      } catch (err) {
        console.log("in if catch")
        throw new AuthenticationError('Invalid/Expired token', err)
      }
    } 
    console.log("Arror")
    throw new Error('Auth token must be: Bearer [token]')
  }
  console.log("Eooeeor")
  throw new Error('Auth token must be provided')
}