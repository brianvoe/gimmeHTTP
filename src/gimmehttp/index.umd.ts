// UMD/CDN entry point.
// The global `GimmeHTTP` IS the UI class, so `new GimmeHTTP({...})` works from
// a script tag. Engine functions are attached as statics (GimmeHTTP.Generate,
// GimmeHTTP.Register, ...) and all built-in clients come pre-registered.
import { GimmeHTTP as GimmeHTTPClass } from './ui/index'
import * as engine from './core/index'
import { allClients } from './clients/index'
import './ui/gimmehttp.scss'

engine.Register(allClients)

const GimmeHTTP = Object.assign(GimmeHTTPClass, engine, { allClients })

export default GimmeHTTP
