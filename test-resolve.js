console.log('process.type:', process.type);
console.log('process.versions:', JSON.stringify(process.versions));

try {
  const resolved = require.resolve('electron');
  console.log('require.resolve electron:', resolved);
} catch(e) {
  console.log('resolve error:', e.message);
}

// Try to find the real module
console.log('module.paths:', module.paths);
console.log('module.globalPaths:', require.resolve.paths('electron'));

// Check if there's a built-in binding
console.log('process.config:', Object.keys(process.config || {}));

// Try process._linkedBinding for various names
['electron', 'electron_app', 'electron_browser', 'atom', 'electron_renderer'].forEach(name => {
  try {
    const b = process._linkedBinding(name);
    console.log('binding', name, typeof b, b ? Object.keys(b).slice(0,5) : 'null');
  } catch(e) {
    console.log('no binding:', name, e.message.substring(0,50));
  }
});

// Try to access through native module
try {
  const native = require('electron').toString();
  console.log('electron toString:', native.substring(0, 100));
} catch(e) {
  console.log('require electron error');
}

// List all built-in modules
try {
  const builtins = require('module').builtinModules;
  console.log('builtins includes electron:', builtins.includes('electron'));
  console.log('builtins count:', builtins.length);
  console.log('first 20:', builtins.slice(0, 20));
} catch(e) {
  console.log('module builtinModules error:', e.message);
}
