import React from 'react'
import ReactDOM from 'react-dom'
import { setContext } from '@apollo/client/link/context'
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client'
import Routes from './routes'
import 'semantic-ui-css/semantic.min.css'

const httpLink = createHttpLink({ uri: 'http://localhost:3000/graphql' })

const middlewareLink = setContext(() => ({
  headers: {
    'x-token': localStorage.getItem('token') || null,
    'x-refresh-token': localStorage.getItem('refreshToken') || null,
  },
}))

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const context = operation.getContext()
    const {
      response: { headers },
    } = context

    if (headers) {
      const token = headers.get('x-token')
      const refreshToken = headers.get('x-refresh-token')

      if (token) {
        localStorage.setItem('token', token)
      }

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
    }
    return response
  })
})

const client = new ApolloClient({
  link: afterwareLink.concat(middlewareLink.concat(httpLink)),
  cache: new InMemoryCache(),
})

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
