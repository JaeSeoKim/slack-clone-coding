import express from 'express'

import apolloServer from './graphql/schema'

const PORT = 3000

const app = express()

// Middleware: GraphQL
apolloServer.applyMiddleware({ app })

app.listen(PORT, () => console.log(`Server Listen on : ${PORT}`))
