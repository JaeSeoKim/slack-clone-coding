import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import apolloServer from './graphql/schema'
import models from './models'
import { refreshTokens } from './lib/auth'

const NODE_ENV = process.env.NODE_ENV || 'development'
if (NODE_ENV === 'development') dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

const addUser = async (req, res, next) => {
  const token = req.headers['x-token']
  if (token) {
    try {
      const { user } = jwt.verify(token, process.env.JWT_SECRET)
      req.user = user
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token']
      const newTokens = await refreshTokens(
        token,
        refreshToken,
        models,
        process.env.JWT_SECRET,
        process.env.JWT_SECRET2,
      )
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token')
        res.set('x-token', newTokens.token)
        res.set('x-refresh-token', newTokens.refreshToken)
      }
      req.user = newTokens.user
    }
  }
  next()
}

// Middlewares
app.use(cors('*'))
app.use(addUser)

// Middleware: GraphQL
apolloServer.applyMiddleware({ app })

models.sequelize
  .sync({})
  .then(() =>
    app.listen(PORT, () => console.log(`\x1b[34m`, `Server Listen on : http://localhost:${PORT}/`, `\x1b[0m`)),
  )
