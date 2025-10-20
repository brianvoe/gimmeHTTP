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

export function GetContentType(headers?: { [key: string]: string | string[] }): string {
  if (!headers) return ''

  // Check for content-type (case-insensitive)
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === 'content-type') {
      return Array.isArray(value) ? value[0] : value
    }
  }

  // Check for accept header as fallback
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === 'accept') {
      return Array.isArray(value) ? value[0] : value
    }
  }

  return ''
}

export function HasBody(body: any): boolean {
  if (!body) return false

  if (typeof body === 'string') {
    return body.length > 0
  }

  if (typeof body === 'object') {
    return Object.keys(body).length > 0
  }

  return false
}

export function IsStringBody(body: any): boolean {
  return typeof body === 'string'
}

export function IsObjectBody(body: any): boolean {
  return body !== null && body !== undefined && typeof body === 'object'
}

export function ContentTypeIncludes(contentType: string, type: 'json' | 'xml' | 'form' | 'text' | 'blob'): boolean {
  const lower = contentType.toLowerCase()

  switch (type) {
    case 'json':
      return lower.includes('application/json')
    case 'xml':
      return lower.includes('application/xml') || lower.includes('text/xml')
    case 'form':
      return lower.includes('application/x-www-form-urlencoded')
    case 'text':
      return lower.includes('text/')
    case 'blob':
      return lower.includes('application/octet-stream') || lower.includes('image/')
    default:
      return false
  }
}

export function InferContentType(body: any): string {
  if (!body) return 'application/octet-stream'

  // If it's a string, check if it looks like JSON
  if (typeof body === 'string') {
    const trimmed = body.trim()
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return 'application/json'
    }
    // Check if it's printable UTF-8 text
    // For simplicity, assume non-empty strings are text
    if (trimmed.length > 0) {
      return 'text/plain; charset=utf-8'
    }
    return 'application/octet-stream'
  }

  // If it's an object, assume JSON
  if (typeof body === 'object') {
    return 'application/json'
  }

  // Default to binary
  return 'application/octet-stream'
}

export function GetEffectiveContentType(
  headers?: { [key: string]: string | string[] },
  body?: any
): { contentType: string; wasInferred: boolean } {
  const explicit = GetContentType(headers)

  if (explicit) {
    return { contentType: explicit, wasInferred: false }
  }

  // No explicit Content-Type, infer from body
  const inferred = InferContentType(body)
  return { contentType: inferred, wasInferred: true }
}
