import React, { useState } from 'react'
import { Message, Form, Button, Input, Container, Header } from 'semantic-ui-react'
import { gql } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

export default observer(() => {
  const [mutateCreateTeam] = useMutation(createTeamMutation)
  const history = useHistory()

  const [data] = useState(() =>
    observable({
      name: '',
      errors: {},
    }),
  )

  const onSubmit = async () => {
    const { name } = data
    let response = null

    try {
      response = await mutateCreateTeam({
        variables: { name },
      })
    } catch (err) {
      history.push('/login')
      return
    }

    console.log(response)

    const { ok, errors } = response.data.createTeam

    if (ok) {
      history.push('/')
    } else {
      const err = {}
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message
      })

      data.errors = err
    }
  }

  const onChange = e => {
    const { name, value } = e.target
    data[name] = value
  }

  return (
    <Container text>
      <Header as="h2">Create a team</Header>
      <Form>
        <Form.Field error={!!data.nameError}>
          <Input name="name" onChange={onChange} value={data.name} placeholder="Name" fluid />
        </Form.Field>
        <Button onClick={onSubmit}>Submit</Button>
      </Form>
      {data.errors.length ? (
        <Message error header="There was some errors with your submission" list={data.errors} />
      ) : null}
    </Container>
  )
})

const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      errors {
        path
        message
      }
    }
  }
`
