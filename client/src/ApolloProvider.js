import React from 'react'
import App from './App'
import {ApolloClient} from '@apollo/client'
import { InMemoryCache, ApolloProvider } from  '@apollo/client'


const client = new ApolloClient({
  uri: "http://localhost:9000",
  cache: new InMemoryCache()
})

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

