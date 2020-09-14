import express from 'express'
import dotenv from 'dotenv'
import apolloServer from './graphql/schema'
import models from './models'

const NODE_ENV = process.env.NODE_ENV || 'development'
if (NODE_ENV === 'development') dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

// Middleware: GraphQL
apolloServer.applyMiddleware({ app })

models.sequelize
  .sync()
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Listen on : http://localhost:${PORT}/`),
    ),
  )
