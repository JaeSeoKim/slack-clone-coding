import { ApolloServer } from 'apollo-server-express'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import path from 'path'
import dotenv from 'dotenv'

import models from '../models'

const NODE_ENV = process.env.NODE_ENV || 'development'
if (NODE_ENV === 'development') dotenv.config()

// Imports: GraphQL TypeDefs & Resolvers
const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './typeDefs')))
const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers')))

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
  context: ({ req }) => {
    return { models, user: req.user, JWT_SECRET: process.env.JWT_SECRET, JWT_SECRET2: process.env.JWT_SECRET2 }
  },
})

// Exports
export default server
