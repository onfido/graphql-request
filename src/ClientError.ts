import { GraphQLRequestContext, GraphQLResponse } from './types'

export class ClientError extends Error {
  constructor(public response: GraphQLResponse, public request: GraphQLRequestContext) {
    super(
      `${ClientError.extractMessage(response)}: ${JSON.stringify({
        response,
        request,
      })}`
    )

    Object.setPrototypeOf(this, ClientError.prototype)

    // this is needed as Safari doesn't support .captureStackTrace
    if (typeof Error.captureStackTrace === 'function') Error.captureStackTrace(this, ClientError)
  }

  private static extractMessage(response: GraphQLResponse): string {
    try {
      return response.errors![0].message
    } catch (e) {
      return `GraphQL Error (Code: ${response.status})`
    }
  }
}
