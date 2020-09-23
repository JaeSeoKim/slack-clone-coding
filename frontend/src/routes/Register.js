import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Message, Button, Container, Header, Input } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'

export default () => {
  const [state, setState] = useState({
    username: '',
    email: '',
    password: '',
    usernameError: '',
    emailError: '',
    passwordError: '',
  })
  const [mutateRegister] = useMutation(registerMutation)
  const history = useHistory()

  const onChangeUserName = e => setState({ ...state, username: e.target.value })
  const onChangeEmail = e => setState({ ...state, email: e.target.value })
  const onChangePassword = e => setState({ ...state, password: e.target.value })

  const handleSubmit = async () => {
    const { username, email, password } = state
    setState({
      ...state,
      usernameError: '',
      emailError: '',
      passwordError: '',
    })
    const response = await mutateRegister({
      variables: { username, email, password },
    })

    const { ok, errors } = response.data.register

    if (ok) {
      history.push('/')
    } else {
      const err = {}
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message
      })

      setState({ ...state, ...{ usernameError: '', emailError: '', passwordError: '' }, ...err })
    }

    console.log(response)
  }

  return (
    <Container text>
      <Header as="h2">Register - Page</Header>
      <Input
        error={!!state.usernameError}
        value={state.username}
        onChange={onChangeUserName}
        name="username"
        placeholder="UserName"
        fluid
      />
      <Input
        error={!!state.emailError}
        value={state.email}
        onChange={onChangeEmail}
        name="email"
        placeholder="Email"
        fluid
      />
      <Input
        error={!!state.passwordError}
        value={state.password}
        onChange={onChangePassword}
        name="password"
        type="password"
        placeholder="Password"
        fluid
      />
      <Button onClick={handleSubmit}>Submit</Button>
      {state.usernameError || state.emailError || state.passwordError ? (
        <Message
          error
          header="There was some errors with your submission"
          list={[
            !!state.usernameError && state.usernameError,
            !!state.emailError && state.emailError,
            !!state.passwordError && state.passwordError,
          ]}
        />
      ) : null}
    </Container>
  )
}

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      user {
        id
        username
        email
      }
      errors {
        path
        message
      }
    }
  }
`
