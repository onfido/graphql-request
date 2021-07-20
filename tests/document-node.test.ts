import gql from 'graphql-tag'
import { request } from '../src'
import { setupTestServer } from './__helpers'

const ctx = setupTestServer()

it('accepts graphql DocumentNode as alternative to raw string', async () => {
  const mock = ctx.res({ body: { data: { foo: 1 } } })
  await request(
    ctx.url,
    gql`
      {
        query {
          users
        }
      }
    `
  )
  expect(mock).toMatchSnapshot()
})
