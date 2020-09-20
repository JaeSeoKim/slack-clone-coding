import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Home from './Home'
import Register from './Register'

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
      </Switch>
    </BrowserRouter>
  )
}
