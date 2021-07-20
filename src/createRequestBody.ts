import { ExtractableFile, extractFiles, isExtractableFile } from 'extract-files'
import FormDataNode from 'form-data'
import { Variables } from './types'

/**
 * Returns Multipart Form if body contains files
 * (https://github.com/jaydenseric/graphql-multipart-request-spec)
 * Otherwise returns JSON
 */
export default function createRequestBody(query: string, variables?: Variables): string | FormData {
  const { clone, files } = extractFiles({ query, variables }, '', isExtractableFileEnhanced)

  if (files.size === 0) return JSON.stringify(clone)

  const Form = typeof FormData === 'function' ? FormData : FormDataNode

  const form: FormData = new Form() as any

  form.append('operations', JSON.stringify(clone))

  const map: { [key: number]: string[] } = {}
  let i = 0
  files.forEach((paths) => (map[++i] = paths))
  form.append('map', JSON.stringify(map))

  i = 0
  files.forEach((_, file) => form.append(`${++i}`, file as Blob))

  return form
}

/**
 * Duck type if NodeJS stream
 * https://github.com/sindresorhus/is-stream/blob/3750505b0727f6df54324784fe369365ef78841e/index.js#L3
 */
const isExtractableFileEnhanced = (value: any): value is ExtractableFile | { pipe: Function } =>
  isExtractableFile(value) ||
  (value !== null && typeof value === 'object' && typeof (value as any).pipe === 'function')
