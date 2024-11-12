export function IsJsonRequest(method: string, headers?: { [key: string]: string }): boolean {
  return (
    method.toUpperCase() === 'POST' &&
    headers !== undefined &&
    Object.keys(headers).some(
      (key) => key.toLowerCase() === 'content-type' && headers[key].toLowerCase() === 'application/json'
    )
  )
}
