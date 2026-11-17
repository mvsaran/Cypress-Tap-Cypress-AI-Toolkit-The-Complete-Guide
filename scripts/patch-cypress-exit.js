/**
 * Patch Cypress CLI on Windows to prevent libuv async assertion crash:
 * "Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94"
 * 
 * Replaces abrupt `process.exit(code)` in tap module handler with graceful `process.exitCode = code`,
 * allowing the Node.js Windows libuv event loop to cleanly drain open WebSocket/IPC handles.
 */
const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'node_modules', 'cypress', 'dist', 'cli-y9Bb9Y77.js');

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  if (content.includes('const code = yield tapModule.start(args || [], _.pick(opts, [\'session\', \'json\', \'timeout\']));\n                        process.exit(code);')) {
    content = content.replace(
      'const code = yield tapModule.start(args || [], _.pick(opts, [\'session\', \'json\', \'timeout\']));\n                        process.exit(code);',
      'const code = yield tapModule.start(args || [], _.pick(opts, [\'session\', \'json\', \'timeout\']));\n                        process.exitCode = code;'
    );
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('[patch-cypress-exit] Successfully patched Cypress CLI for Windows libuv compatibility.');
  } else {
    console.log('[patch-cypress-exit] Cypress CLI is already patched or up to date.');
  }
}
