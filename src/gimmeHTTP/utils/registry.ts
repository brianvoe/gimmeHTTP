export interface Client {
  default?: boolean
  language: string
  client: string
  generate: (config: any, http: any) => string
}

const codes: Client[] = []

export function Codes(): Client[] {
  return codes
}

export function Languages(): string[] {
  // return all unque languages
  return codes.map((c) => c.language).filter((v, i, a) => a.indexOf(v) === i)
}

// Search for client, whether or not they pass in a client
// If no client, return the default client of that language
export function Search(language: string, client?: string): Client | null {
  if (language === '' || language === undefined) {
    return null
  }

  // Loop through and get all clients for the language
  const clients = codes.filter((c) => c.language.toLowerCase() === language.toLowerCase())
  if (clients.length === 0) {
    return null
  }

  // Get default client
  const defaultClient: Client = clients.find((c) => c.default) || clients[0]

  // If no client, return default
  if (!client) {
    return defaultClient
  }

  // If client, return the client
  const clientResult = clients.find((c) => c.client.toLowerCase() === client.toLowerCase())
  if (!clientResult) {
    return defaultClient
  }

  return clientResult
}

export function SetDefault(language: string, client: string): void {
  const clientResult = Search(language, client)
  if (!clientResult) {
    return
  }

  // Set the client as default
  clientResult.default = true
}

export function Register(client: Client | Client[]): Error | null {
  if (!client) {
    return new Error('Client is required')
  }

  // Register multiple clients
  if (Array.isArray(client)) {
    client.forEach((g) => Register(g))
    return null
  }

  // Get current list of clients from client.language
  const curClients = codes.filter((c) => c.language.toLowerCase() === client.language.toLowerCase())
  const exists = curClients.find((c) => c.client.toLowerCase() === client.client.toLowerCase())

  // Set default to false if undefined
  if (client.default === undefined) {
    client.default = curClients.length === 0 ? true : false
  }

  // If it exist, overwrite the client
  if (exists) {
    const index = codes.indexOf(client)
    codes[index] = client
    return null
  }

  // otherwise, add the client
  codes.push(client)

  return null
}

export function ClearRegistry(): void {
  codes.splice(0, codes.length)
}
