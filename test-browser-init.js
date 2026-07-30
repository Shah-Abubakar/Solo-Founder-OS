try {
  const bi = require('electron/js2c/browser_init');
  console.log('browser_init type:', typeof bi);
  console.log('browser_init keys:', bi ? Object.keys(bi).slice(0,20) : 'null');
} catch(e) {
  console.log('browser_init error:', e.message.substring(0,80));
}

try {
  const ni = require('electron/js2c/node_init');
  console.log('node_init type:', typeof ni);
} catch(e) {
  console.log('node_init error:', e.message.substring(0,80));
}

// List all native modules that might contain electron APIs
try {
  const nm = process._linkedBinding;
  console.log('_linkedBinding exists:', typeof nm);
  // Get all available native modules
  const builtins = require('module').builtinModules;
  const electronBuiltins = builtins.filter(m => m.includes('electron'));
  console.log('electron builtins:', electronBuiltins);
  
  // The native modules that actually provide the API
  console.log('\n--- Trying to get native module: electron ---');
  const mod = process.moduleLoadList?.filter(m => m.includes('NativeModule'));
  console.log('NativeModules loaded:', mod?.slice(0,20));

  // Check if there are native modules we can require
  for (const name of electronBuiltins) {
    try {
      const m = require(name);
      console.log(name, typeof m, typeof m === 'object' ? Object.keys(m).slice(0,8) : 'scalar');
    } catch(e) {
      // skip
    }
  }
} catch(e) {
  console.log('error:', e.message);
}
