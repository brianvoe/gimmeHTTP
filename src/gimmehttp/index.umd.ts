// UMD entry point - creates a default export with all named exports attached
// This avoids the mixed exports issue for UMD/IIFE builds
import * as namedExports from './index'

// Create a default export object with all named exports
const GimmeHTTP = Object.assign({}, namedExports)

export default GimmeHTTP
