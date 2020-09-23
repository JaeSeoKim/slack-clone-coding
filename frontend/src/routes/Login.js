import React, { useState } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { Button, Container, Header, Input } from 'semantic-ui-react'
import { gql, useMutation } from '@apollo/client'

export default observer(() => {
  const [data] = useState(() =>
    observable({
      email: '',
      password: '',
    }),
  )

  const [mutateLogin] = useMutation(loginMutaion)

  const onChange = e => {
    const { name, value } = e.target
    data[name] = value
  }

  const onSubmit = async () => {
    const { email, password } = data
    const response = await mutateLogin({
      variables: { email, password },
    })
    console.log(response)
    const { ok, token, refreshToken } = response.data.login
    if (ok) {
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
    }
  }

  return (
    <Container text>
      <Header as="h2">Login</Header>
      <Input name="email" onChange={onChange} value={data.email} placeholder="Email" fluid />
      <Input name="password" onChange={onChange} value={data.password} type="password" placeholder="Password" fluid />
      <Button onClick={onSubmit}>Submit</Button>
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
