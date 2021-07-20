import { ClientError } from './ClientError'
import createRequestBody from './createRequestBody'
import { resolveHeaders } from './resolveHeaders'
import { Init, Variables } from './types'

export async function rawRequest<T = any, V = Variables>(
  url: string,
  query: string,
  variables?: V,
  requestInit: Init = {}
): Promise<{ data: T; extensions?: any; headers: Headers; status: number }> {
  const { headers, fetch: localFetch = fetch, ...rest } = requestInit
  const body = createRequestBody(query, variables)

  const response = await localFetch(url, {
    body,
    method: 'POST',
    headers: {
      ...(typeof body === 'string' && { 'Content-Type': 'application/json' }),
      ...resolveHeaders(headers),
    },
    ...rest,
  })

  const result = await getResult(response)

  if (response.ok && !result.errors && result.data) {
    const { headers, status } = response
    return { ...result, data: result.data, headers, status }
  }

  const error = typeof result === 'string' ? { error: result } : result
  throw new ClientError(
    { ...error, status: response.status, headers: response.headers },
    { query, variables }
  )
}

const getResult = (response: Response): Promise<any> =>
  response.headers.get('Content-Type')?.startsWith('application/json') ? response.json() : response.text()
