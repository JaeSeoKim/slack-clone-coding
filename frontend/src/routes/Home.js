import React from 'react'
import { gql, useQuery } from '@apollo/client'

const allUserQuery = gql`
  query {
    allUsers {
      id
      username
      email
    }
  }
`

export default () => {
  const { loading, error, data } = useQuery(allUserQuery)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  return data.allUsers.map(user => (
    <div key={user.id}>
      <h1>{user.username}</h1>
      <h3>{user.email}</h3>
    </div>
  ))
}
