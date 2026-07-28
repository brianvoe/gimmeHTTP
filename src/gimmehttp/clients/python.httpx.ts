import { Builder } from '../utils/builder'
import { Config, Http } from '../utils/generate'
import { Client } from '../utils/registry'
import { ContentTypeIncludes, GetContentType, HasBody, IsObjectBody, IsStringBody } from '../utils/utils'

export default {
  language: 'python',
  client: 'httpx',
  generate(config: Config, http: Http): string {
    const builder = new Builder({
      indent: config.indent || '  ',
      join: config.join || '\n',
      json: { nullLiteral: 'None' }
    })
    const params: string[] = []
    const contentType = GetContentType(http.headers)

    builder.line('import httpx')
    builder.line()

    if (config.handleErrors) {
      builder.line('try:')
      builder.indent()
    }

    builder.line('url = "%s"', http.url)

    if (http.params && Object.keys(http.params).length > 0) {
      builder.line()
      params.push('params=url_params')
      builder.line('url_params = ')
      builder.json(http.params)
    }

    if (http.headers && Object.keys(http.headers).length > 0) {
      builder.line()
      params.push('headers=headers')
      builder.line('headers = ')
      builder.json(http.headers)
    }

    if (http.cookies && Object.keys(http.cookies).length > 0) {
      builder.line()
      params.push('cookies=cookies')
      builder.line('cookies = ')
      builder.json(http.cookies)
    }

    if (HasBody(http.body)) {
      builder.line()
      if (IsStringBody(http.body)) {
        params.push(builder.format('data="%s"', http.body))
      } else if (ContentTypeIncludes(contentType, 'form')) {
        params.push('data=form_data')
        builder.line('form_data = ')
        builder.json(http.body)
      } else if (IsObjectBody(http.body) && (ContentTypeIncludes(contentType, 'json') || !contentType)) {
        params.push('json=json_data')
        builder.line('json_data = ')
        builder.json(http.body)
      } else {
        params.push('data=payload')
        builder.line('payload = ')
        builder.json(http.body)
      }
    }

    builder.line()
    builder.line('with httpx.Client() as client:')
    builder.indent()
    builder.line('response = client.%r(url%r)', http.method.toLowerCase(), params.length > 0 ? `, ${params.join(', ')}` : '')
    if (config.handleErrors) builder.line('response.raise_for_status()')
    builder.line('print(response.text)')
    builder.outdent()

    if (config.handleErrors) {
      builder.outdent()
      builder.line('except httpx.HTTPError as e:')
      builder.indent()
      builder.line('print(f"Error: {e}")')
      builder.outdent()
    }

    return builder.output()
  }
} as Client
