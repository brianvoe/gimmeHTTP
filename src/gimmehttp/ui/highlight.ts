// Bundled highlight.js setup for the UI layer.
// All grammars for languages gimmehttp ships are registered up front
// so the first paint is already highlighted.
import hljs from 'highlight.js/lib/core'

import c from 'highlight.js/lib/languages/c'
import csharp from 'highlight.js/lib/languages/csharp'
import dart from 'highlight.js/lib/languages/dart'
import go from 'highlight.js/lib/languages/go'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import kotlin from 'highlight.js/lib/languages/kotlin'
import objectivec from 'highlight.js/lib/languages/objectivec'
import php from 'highlight.js/lib/languages/php'
import powershell from 'highlight.js/lib/languages/powershell'
import python from 'highlight.js/lib/languages/python'
import r from 'highlight.js/lib/languages/r'
import ruby from 'highlight.js/lib/languages/ruby'
import rust from 'highlight.js/lib/languages/rust'
import bash from 'highlight.js/lib/languages/bash'
import swift from 'highlight.js/lib/languages/swift'
import typescript from 'highlight.js/lib/languages/typescript'
import json from 'highlight.js/lib/languages/json'

hljs.registerLanguage('c', c)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('dart', dart)
hljs.registerLanguage('go', go)
hljs.registerLanguage('java', java)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('kotlin', kotlin)
hljs.registerLanguage('objectivec', objectivec)
hljs.registerLanguage('objc', objectivec)
hljs.registerLanguage('php', php)
hljs.registerLanguage('powershell', powershell)
hljs.registerLanguage('python', python)
hljs.registerLanguage('r', r)
hljs.registerLanguage('ruby', ruby)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('shellscript', bash)
hljs.registerLanguage('swift', swift)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('node', javascript)
hljs.registerLanguage('nodejs', javascript)

// Map gimmehttp language names to highlight.js grammar names
export const languageMap: Record<string, string> = {
  shellscript: 'bash',
  shell: 'bash',
  ts: 'typescript',
  node: 'javascript',
  nodejs: 'javascript',
  objc: 'objectivec'
}

export function highlightCode(code: string, language: string): string {
  const hljsLang = languageMap[language] || language
  try {
    return hljs.highlight(code, { language: hljsLang, ignoreIllegals: true }).value
  } catch {
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }
}

export function highlightLanguage(language: string): string {
  return languageMap[language] || language
}

export default hljs
