import React, { useMemo, useState } from 'react'
import { GimmeHttp } from '@/gimmehttp/react'
import type { Settings } from '@/gimmehttp'
import type { Http } from '@/gimmehttp/core'

type Preset = {
  id: string
  label: string
  http: Http
}

const presets: Preset[] = [
  {
    id: 'get',
    label: 'GET',
    http: {
      method: 'GET',
      url: 'https://api.example.com/users?limit=5',
      headers: { Accept: 'application/json' }
    }
  },
  {
    id: 'post',
    label: 'POST',
    http: {
      method: 'POST',
      url: 'https://api.example.com/users',
      headers: { 'Content-Type': 'application/json' },
      body: { first_name: 'Ada', role: 'admin' }
    }
  },
  {
    id: 'delete',
    label: 'DELETE',
    http: {
      method: 'DELETE',
      url: 'https://api.example.com/users/42',
      headers: { Authorization: 'Bearer <token>' },
      cookies: { session_id: 'abc123' }
    }
  }
]

/** Live React demo mounted from the Vue docs page. */
export function ReactLiveDemo() {
  const [presetId, setPresetId] = useState('get')
  const [language, setLanguage] = useState('go')
  const [client, setClient] = useState('http')

  const settings = useMemo<Settings>(() => {
    const preset = presets.find((p) => p.id === presetId) ?? presets[0]
    return {
      language,
      client,
      theme: 'dark',
      http: preset.http
    }
  }, [presetId, language, client])

  return (
    <div className="react-live-demo">
      <div className="live_controls" role="group" aria-label="Request preset">
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            className={presetId === p.id ? 'active' : undefined}
            onClick={() => setPresetId(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="live_meta">
        Selection: <code>{language}</code> / <code>{client}</code>
      </p>
      <GimmeHttp
        settings={settings}
        onLanguageChange={setLanguage}
        onClientChange={setClient}
      />
    </div>
  )
}
