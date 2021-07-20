import fetch from 'cross-fetch'
import { GraphQLClient } from '../src'
import { setupTestServer } from './__helpers'

const ctx = setupTestServer()

test('with custom fetch', async () => {
  ctx.res({ body: { data: {} } })
  const customFetch = jest.fn(fetch)

  const client = new GraphQLClient(ctx.url, { fetch: customFetch })
  await client.request(`{ me { id } }`)

  expect(customFetch).toBeCalledTimes(1)
})
