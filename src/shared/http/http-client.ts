import { appError, err, ok, type Result } from '@/shared/result'

import { HTTP_ERRORS, type HttpError } from './http-error'

export async function getJson<T>(url: string): Promise<Result<T, HttpError>> {
  let response: Response
  try {
    response = await fetch(url)
  } catch (cause) {
    return err(appError(HTTP_ERRORS.NETWORK, {}, cause))
  }

  if (!response.ok) {
    return err(appError(HTTP_ERRORS.STATUS, { status: response.status }))
  }

  try {
    const data = (await response.json()) as T
    return ok(data)
  } catch (cause) {
    return err(appError(HTTP_ERRORS.PARSE, {}, cause))
  }
}
