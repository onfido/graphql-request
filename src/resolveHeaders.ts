/**
 * Convert the given headers configuration into a plain object.
 */
export function resolveHeaders(headers: RequestInit['headers']): Record<string, string> {
  if (!headers) return {}

  if (isHeaderInstance(headers)) return headersInstanceToPlainObject(headers)

  if (Array.isArray(headers))
    return headers.reduce((obj, [name, value]) => {
      obj[name] = value
      return obj
    }, {} as Record<string, string>)

  return headers
}

const isHeaderInstance = (headers: RequestInit['headers']): headers is Headers =>
  typeof Headers === 'function' && headers instanceof Headers

/**
 * Convert Headers instance into regular object
 */
function headersInstanceToPlainObject(headers: Response['headers']): Record<string, string> {
  const obj: Record<string, string> = {}
  headers.forEach((value, key) => (obj[key] = value))
  return obj
}
