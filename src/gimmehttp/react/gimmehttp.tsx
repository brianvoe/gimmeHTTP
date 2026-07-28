/**
 * React wrapper around the vanilla GimmeHTTP UI class.
 *
 * Mount once into a host div, sync `settings` via setSettings, destroy on unmount.
 * Selection changes surface through onLanguageChange / onClientChange.
 */
/// <reference path="./scss.d.ts" />
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { GimmeHTTP } from '../ui/gimmehttp'
import type { Settings } from '../ui/gimmehttp'

import '../ui/gimmehttp.scss'


export interface GimmeHttpProps {
  settings: Settings
  onLanguageChange?: (language: string) => void
  onClientChange?: (client: string) => void
}

export interface GimmeHttpRef {
  gimmeHttp: GimmeHTTP | null
}

const GimmeHttp = forwardRef<GimmeHttpRef, GimmeHttpProps>(
  ({ settings, onLanguageChange, onClientChange }, ref) => {
    const hostRef = useRef<HTMLDivElement>(null)
    const instanceRef = useRef<GimmeHTTP | null>(null)
    const initialSettingsRef = useRef(settings)
    const onLanguageChangeRef = useRef(onLanguageChange)
    const onClientChangeRef = useRef(onClientChange)
    const [ready, setReady] = useState(false)

    useEffect(() => {
      onLanguageChangeRef.current = onLanguageChange
    }, [onLanguageChange])

    useEffect(() => {
      onClientChangeRef.current = onClientChange
    }, [onClientChange])

    useImperativeHandle(
      ref,
      () => ({
        gimmeHttp: instanceRef.current
      }),
      [ready]
    )

    useEffect(() => {
      if (!hostRef.current) {
        return
      }

      const instance = new GimmeHTTP({
        container: hostRef.current,
        settings: initialSettingsRef.current,
        events: {
          afterChange: (language, client) => {
            onLanguageChangeRef.current?.(language)
            onClientChangeRef.current?.(client)
          }
        }
      })
      instanceRef.current = instance
      setReady(true)

      return () => {
        setReady(false)
        instance.destroy()
        instanceRef.current = null
      }
    }, [])

    useEffect(() => {
      instanceRef.current?.setSettings(settings)
    }, [settings])

    return <div className="gimmehttp-wrap" ref={hostRef} />
  }
)

GimmeHttp.displayName = 'GimmeHttp'

export default GimmeHttp
