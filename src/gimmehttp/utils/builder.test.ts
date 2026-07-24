import { Builder } from './builder'
import { beforeEach, describe, expect, test } from 'vitest'

describe('Builder', () => {
  let builder: Builder

  beforeEach(() => {
    builder = new Builder()
  })

  test('should add a line without indentation', () => {
    builder.line('Hello, World!')
    expect(builder.output()).toBe('Hello, World!')
  })

  test('should add a line with indentation', () => {
    builder.indent()
    builder.line('Indented line')
    expect(builder.output()).toBe('  Indented line')
  })

  test('should add multiple lines with different indentation levels', () => {
    builder.line('First line')
    builder.indent()
    builder.line('Second line indented')
    builder.indent()
    builder.line('Third line double indented')
    builder.outdent()
    builder.line('Fourth line single indented')
    builder.outdent()
    builder.line('Fifth line no indentation')
    expect(builder.output()).toBe(
      'First line\n  Second line indented\n    Third line double indented\n  Fourth line single indented\nFifth line no indentation'
    )
  })

  test('should handle outdent correctly when no indentation is present', () => {
    builder.outdent()
    builder.line('No indentation')
    expect(builder.output()).toBe('No indentation')
  })

  test('should add empty lines', () => {
    builder.line('First line')
    builder.line()
    builder.line('Second line')
    expect(builder.output()).toBe('First line\n\nSecond line')
  })

  test('should append to the last line', () => {
    builder.line('Hello')
    builder.append(', World!')
    expect(builder.output()).toBe('Hello, World!')
  })

  test('should append to the last line with multiple indentations', () => {
    builder.line('First line')
    builder.indent()
    builder.line('Second line')
    builder.append(' appended')
    builder.indent()
    builder.line('Third line')
    builder.append(' appended again')
    builder.append(' and more')
    expect(builder.output()).toBe('First line\n  Second line appended\n    Third line appended again and more')
  })

  test('line %s escapes values for double-quoted literals', () => {
    builder.line('url := "%s"', 'https://example.com/"quoted"')
    expect(builder.output()).toBe('url := "https://example.com/\\"quoted\\""')
  })

  test('line %r inserts values without escaping', () => {
    builder.line('client.%r("%s")', 'Get', 'a"b')
    expect(builder.output()).toBe('client.Get("a\\"b")')
  })

  test('line %% emits a literal percent sign', () => {
    builder.line('progress := "100%%"')
    // no format args: pass-through keeps %% as written
    expect(builder.output()).toBe('progress := "100%%"')

    builder = new Builder()
    builder.line('progress := "%s%%"', '100')
    expect(builder.output()).toBe('progress := "100%"')
  })

  test('line with no format args is unchanged (backwards compatible)', () => {
    builder.line('const headers = {};')
    expect(builder.output()).toBe('const headers = {};')
  })

  test('line throws when a placeholder is missing an argument', () => {
    expect(() => builder.line('"%s" = "%s"', 'only-one')).toThrow(/missing argument/)
  })

  test('line throws when there are unused format arguments', () => {
    expect(() => builder.line('"%s"', 'a', 'b')).toThrow(/unused format argument/)
  })

  test('append supports the same %s / %r formatting', () => {
    builder.line('req.Header.Set(')
    builder.append('"%s", "%s"', 'X-Name', 'a"b')
    builder.append(')')
    expect(builder.output()).toBe('req.Header.Set("X-Name", "a\\"b")')
  })

  test('format returns a formatted string without writing a line', () => {
    expect(builder.format('bytes.NewBufferString("%s")', 'a"b')).toBe('bytes.NewBufferString("a\\"b")')
    expect(builder.output()).toBe('')
  })

  test('line uses a custom escapeString when configured', () => {
    builder = new Builder({
      json: {
        escapeString: (value) => value.replace(/'/g, "\\'")
      }
    })
    builder.line("msg = '%s'", "it's")
    expect(builder.output()).toBe("msg = 'it\\'s'")
  })

  // JSON
  test('should handle null JSON', () => {
    builder.json(null)
    expect(builder.output()).toBe('null')
  })

  test('should handle simple JSON object', () => {
    builder.json({ key: 'value' })
    expect(builder.output()).toBe(`{
  "key": "value"
}`)
  })

  test('should handle nested JSON object', () => {
    builder.json({ key: { nestedKey: 'nestedValue' } })
    expect(builder.output()).toBe(`{
  "key": {
    "nestedKey": "nestedValue"
  }
}`)
  })

  test('should handle JSON array', () => {
    builder.json(['value1', 'value2'])
    expect(builder.output()).toBe(`[
  "value1",
  "value2"
]`)
  })

  test('should handle nested JSON array', () => {
    builder.json([{ key: 'value1' }, { key: 'value2' }])
    expect(builder.output()).toBe(`[{
    "key": "value1"
  },{
    "key": "value2"
  }
]`)
  })

  test('should handle mixed JSON object', () => {
    builder.json({
      username: 'fujidosjfds',
      isValid: true,
      age: 25,
      friends: ['alice', 'bob'],
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip: 62701
      },
      pets: [
        { name: 'fluffy', type: 'cat', age: 9 },
        { name: 'fido', type: 'dog', age: 5 }
      ],
      empty: null,
      payments: [
        { amount: 100, date: '2021-01-01' },
        { amount: 200, date: '2021-02-01' }
      ]
    })
    expect(builder.output()).toBe(`{
  "username": "fujidosjfds",
  "isValid": true,
  "age": 25,
  "friends": [
    "alice",
    "bob"
  ],
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zip": 62701
  },
  "pets": [{
      "name": "fluffy",
      "type": "cat",
      "age": 9
    },{
      "name": "fido",
      "type": "dog",
      "age": 5
    }
  ],
  "empty": null,
  "payments": [{
      "amount": 100,
      "date": "2021-01-01"
    },{
      "amount": 200,
      "date": "2021-02-01"
    }
  ]
}`)
  })

  test('should handle json to php output', () => {
    builder = new Builder({
      json: {
        objOpen: '[',
        objClose: ']',
        arrOpen: '[',
        arrClose: ']',
        separator: ' => ',
        endComma: true
      }
    })
    builder.json({
      username: 'fujidosjfds',
      isValid: true,
      age: 25,
      friends: ['alice', 'bob'],
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip: 62701
      },
      empty: null,
      payments: [
        { amount: 100, date: '2021-01-01' },
        { amount: 200, date: '2021-02-01' }
      ]
    })
    expect(builder.output()).toBe(
      `
[
  "username" => "fujidosjfds",
  "isValid" => true,
  "age" => 25,
  "friends" => [
    "alice",
    "bob",
  ],
  "address" => [
    "street" => "123 Main St",
    "city" => "Springfield",
    "state" => "IL",
    "zip" => 62701,
  ],
  "empty" => null,
  "payments" => [[
      "amount" => 100,
      "date" => "2021-01-01",
    ],[
      "amount" => 200,
      "date" => "2021-02-01",
    ],
  ],
]`.trim()
    )
  })
})
