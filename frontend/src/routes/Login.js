import React from 'react'
import { extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import { Button, Container, Header, Input } from 'semantic-ui-react'

export default observer(
  class Login extends React.Component {
    constructor(_props) {
      super()

      extendObservable(this, {
        email: '',
        password: '',
      })
    }

    onChange = e => {
      const { name, value } = e.target
      this[name] = value
    }

    onSubmit = () => {
      const { email, password } = this
      console.log(email, password)
    }

    render() {
      const { email, password } = this

      return (
        <Container text>
          <Header as="h2">Login</Header>
          <Input
            name="email"
            onChange={this.onChange}
            value={email}
            placeholder="Email"
            fluid
          />
          <Input
            name="password"
            onChange={this.onChange}
            value={password}
            type="password"
            placeholder="Password"
            fluid
          />
          <Button onClick={this.onSubmit}>Submit</Button>
        </Container>
      )
    }
  },
)
