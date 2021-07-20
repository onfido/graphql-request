import { rawRequest } from './rawRequest'
import { request } from './request'
import { resolveHeaders } from './resolveHeaders'
import { Init, RequestDocument, Variables } from './types'

export class GraphQLClient {
  constructor(private url: string, private options: Init = {}) {}

  rawRequest<T = any, V = Variables>(query: string, variables?: V, init?: Init) {
    return rawRequest<T, V>(this.url, query, variables, mergeInits(this.options, init))
  }

  /**
   * Send a GraphQL document to the server.
   */
  request<T = any, V = Variables>(document: RequestDocument, variables?: V, init?: Init) {
    return request<T, V>(this.url, document, variables, mergeInits(this.options, init))
  }

  setHeaders(headers: RequestInit['headers']): GraphQLClient {
    this.options.headers = headers
    return this
  }

  /**
   * Attach a header to the client. All subsequent requests will have this header.
   */
  setHeader(key: string, value: string): GraphQLClient {
    const headers = (this.options.headers ??= {})

    // todo what if headers is in nested array form... ?
    headers[key as keyof typeof headers] = value

    return this
  }
}

const mergeInits = (...inits: (Init | undefined)[]): Init | undefined =>
  inits.reduce(
    (merged, next) => ({
      ...merged,
      ...next,
      headers: {
        ...resolveHeaders(merged?.headers),
        ...resolveHeaders(next?.headers),
      },
    }),
    {}
  )
