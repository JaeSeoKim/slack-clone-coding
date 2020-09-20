import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Button, Container, Header, Input } from 'semantic-ui-react'

export default () => {
  const [state, setState] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [register] = useMutation(registerMutation)

  const onChangeUserName = e => setState({ ...state, username: e.target.value })
  const onChangeEmail = e => setState({ ...state, email: e.target.value })
  const onChangePassword = e => setState({ ...state, password: e.target.value })

  const handleSubmit = async () => {
    const {data: {register: isRegistered}} = await register({ variables: state })
    console.log(isRegistered)
  }

  return (
    <Container text>
      <Header as="h2">Register - Page</Header>
      <Input
        value={state.username}
        onChange={onChangeUserName}
        name="username"
        placeholder="UserName"
        fluid
      />
      <Input
        value={state.email}
        onChange={onChangeEmail}
        name="email"
        placeholder="Email"
        fluid
      />
      <Input
        value={state.password}
        onChange={onChangePassword}
        name="password"
        type="password"
        placeholder="Password"
        fluid
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  )
}

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password)
  }
`
