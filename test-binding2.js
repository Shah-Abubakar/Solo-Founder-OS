const Module = require('module');
const origResolve = Module._resolveFilename;
console.log('origResolve type:', typeof origResolve);

// Check if there's a hook registered
const resolveFilename = origResolve.toString();
console.log('resolveFilename length:', resolveFilename.length);

// Check if electron-builder or any hook is registered on Module
console.log('Module._extensions keys:', Object.keys(Module._extensions).join(', '));

// Check the global process for electron-specific properties
const electronProps = Object.keys(process).filter(k => k.includes('electron') || k.includes('Electron') || k === 'type' || k === 'noDeprecation' || k === 'noAsar');
console.log('process.electron props:', JSON.stringify(electronProps));
console.log('process.type:', process.type);
console.log('process.noAsar:', process.noAsar);

// Try original-fs
try {
  const ofs = require('original-fs');
  console.log('original-fs type:', typeof ofs);
  console.log('original-fs keys:', Object.keys(ofs).slice(0,10).join(','));
} catch(e) { console.log('original-fs failed:', e.message); }
