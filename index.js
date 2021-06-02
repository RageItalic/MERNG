const {ApolloServer, PubSub} = require("apollo-server")
const mongoose = require("mongoose")

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const {MONGODB} = require('./config.js')

const pubSub = new PubSub()

const server = new ApolloServer({
  typeDefs, 
  resolvers, 
  context: ({req}) => ({req, pubSub})
})

// const fs  =  require("fs")
// const stream = fs.createReadStream("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3")
// console.log(
//   "hi", stream
// )

mongoose.connect(MONGODB, {useNewUrlParser: true})
  .then(() => {
    console.log("DB connected")
    return server.listen({port: 9000})
  })
  .then(res => console.log(`server running at ${res.url}`))
