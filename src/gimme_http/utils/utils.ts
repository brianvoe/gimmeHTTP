interface Url {
  hostname: string
  path: string
  port: number
  protocol: string
  params: string
}

export function ParseUrl(url: string): Url {
  let hostname, path, port, protocol, params

  try {
    // Try to parse the URL, using the URL class
    const parsedUrl = new URL(url)
    hostname = parsedUrl.hostname
    path = parsedUrl.pathname
    params = parsedUrl.search
    port = parsedUrl.port ? parseInt(parsedUrl.port) : parsedUrl.protocol === 'https:' ? 443 : 80
    protocol = parsedUrl.protocol
  } catch (error) {
    // If the URL is invalid, parse it manually
    const urlParts = url.split('/')
    hostname = urlParts[0]
    const pathAndParams = '/' + urlParts.slice(1).join('/')
    const [pathPart, paramsPart] = pathAndParams.split('?')
    path = pathPart
    params = paramsPart ? '?' + paramsPart : ''
    port = 80
    protocol = 'http:'
  }

  // Ensure path starts with a slash
  if (!path.startsWith('/')) {
    path = '/' + path
  }

  return { hostname, path, port, protocol, params }
}

export function IsJsonRequest(method: string, headers?: { [key: string]: string }): boolean {
  return (
    method.toUpperCase() === 'POST' &&
    headers !== undefined &&
    Object.keys(headers).some(
      (key) => key.toLowerCase() === 'content-type' && headers[key].toLowerCase() === 'application/json'
    )
  )
}
