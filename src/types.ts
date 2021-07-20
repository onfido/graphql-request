import { DocumentNode } from 'graphql/language/ast'

export type Variables = { [key: string]: any }

export interface GraphQLError {
  message: string
  locations: { line: number; column: number }[]
  path: string[]
}

export interface GraphQLResponse<T = any> {
  data?: T
  errors?: GraphQLError[]
  extensions?: any
  status: number
  [key: string]: any
}

export interface GraphQLRequestContext<V = Variables> {
  query: string
  variables?: V
}

export type RequestDocument = string | DocumentNode

export interface Init extends RequestInit {
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>
}
