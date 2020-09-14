import { ApolloServer } from 'apollo-server-express'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import path from 'path'

import models from '../models'

// Imports: GraphQL TypeDefs & Resolvers
const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, './typeDefs')),
)
const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, './resolvers')),
)

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
  context: {
    models,
    // TODO: JWT TOKEN으로 user 정보 넣어주기.
    user: 1,
  },
})

// Exports
export default server
