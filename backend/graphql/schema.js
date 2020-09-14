import { ApolloServer } from 'apollo-server-express'
// Imports: GraphQL TypeDefs & Resolvers
import resolvers from './resolvers'
import typeDefs from './typeDefs'

// GraphQL: Schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: `/graphql`,
    settings: {
      'editor.theme': 'dark',
    },
  },
})

// Exports
export default server
