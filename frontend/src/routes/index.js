import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

import CreateTeam from './CreateTeam'
import Home from './Home'
import Login from './Login'
import Register from './Register'

const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  const refreshToken = localStorage.getItem('refreshToken')
  try {
    jwt_decode(token)
    jwt_decode(refreshToken)
  } catch (err) {
    return false
  }

  return true
}

const PrivateRoute = ({ children, ...rest }) => (
  <Route {...rest}>
    {isAuthenticated() ? (
      children
    ) : (
      <Redirect
        to={{
          pathname: '/login',
        }}
      />
    )}
  </Route>
)

export default () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/register" exact>
          <Register />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <PrivateRoute path="/create-team" exact>
          <CreateTeam />
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  )
}
