import React, { useState } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { Button, Container, Form, Header, Input, Message } from 'semantic-ui-react'
import { gql, useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'

export default observer(() => {
  const [mutateLogin] = useMutation(loginMutaion)
  const history = useHistory()

  const [data] = useState(() =>
    observable({
      eail: '',
      password: '',
      errors: {
        emailError: '',
        passwordError: '',
      },
    }),
  )

  const onChange = e => {
    const { name, value } = e.target
    data[name] = value
  }

  const onSubmit = async () => {
    const { email, password } = data
    const response = await mutateLogin({
      variables: { email, password },
    })

    // :LOG:
    console.log('[login]', response)

    const { ok, token, refreshToken, errors } = response.data.login
    if (ok) {
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      history.push('/')
    } else {
      const errorList = {}
      errors.forEach(({ path, message }) => {
        errorList[`${path}Error`] = message
      })
      data.errors = errorList
    }
  }

  return (
    <Container text>
      <Header as="h2">Login</Header>
      <Form>
        <Form.Field error={!!data.errors.emailError}>
          <Input name="email" onChange={onChange} value={data.email} placeholder="Email" fluid />
        </Form.Field>
        <Form.Field error={!!data.errors.passwordError}>
          <Input
            name="password"
            onChange={onChange}
            value={data.password}
            type="password"
            placeholder="Password"
            fluid
          />
        </Form.Field>
        <Form.Field>
          <Button onClick={onSubmit}>Submit</Button>
        </Form.Field>
      </Form>
      {data.errors.emailError || data.errors.passwordError ? (
        <Message
          error
          header="There was some errors with your submission"
          list={[
            !!data.errors.emailError && data.errors.emailError,
            !!data.errors.passwordError && data.errors.passwordError,
          ]}
        />
      ) : null}
    </Container>
  )
})

const loginMutaion = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`
