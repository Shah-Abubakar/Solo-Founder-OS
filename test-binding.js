// Try different ways to get Electron API
const path = require('path');

// Method 1: Check if we can use process._linkedBinding
try {
  const bindings = process._linkedBinding('electron_renderer_ipc');
  console.log('Method 1 - _linkedBinding:', typeof bindings);
} catch(e) { console.log('Method 1 failed:', e.message); }

// Method 2: Look for electron in module cache
const Module = require('module');
const resolved = Module._resolveFilename('electron', module);
console.log('Resolved electron path:', resolved);

// Method 3: Try require.resolve
try {
  const resolved2 = require.resolve('electron');
  console.log('require.resolve:', resolved2);
} catch(e) { console.log('require.resolve failed:', e.message); }

// Method 4: Check if electron_main binding exists
try {
  const mainBinding = process._linkedBinding('electron_main');
  console.log('Method 4 - electron_main:', typeof mainBinding);
} catch(e) { console.log('Method 4 failed:', e.message); }

// Method 5: Try the module path directly
const electronReal = path.join(__dirname, 'node_modules', 'electron', 'dist', 'resources', 'electron.asar');
console.log('electron.asar path:', electronReal);
try {
  const fs = require('fs');
  console.log('electon.asar exists:', fs.existsSync(electronReal));
} catch(e) {}
