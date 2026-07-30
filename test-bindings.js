console.log('process.type:', process.type);
console.log('process.versions.electron:', process.versions.electron);

// Try all possible binding names
const names = [
  'electron_browser', 'electron_main', 'electron_renderer',
  'electron_common', 'electron', 'atom',
  'native_electron', 'app', 'browser_window'
];

names.forEach(n => {
  try {
    const b = process._linkedBinding(n);
    if (b && typeof b === 'object') {
      console.log(`binding "${n}":`, typeof b, Object.keys(b).slice(0,12).join(', '));
    } else {
      console.log(`binding "${n}":`, typeof b, String(b).substring(0,50));
    }
  } catch(e) {
    // skip
  }
});

// Check global objects
console.log('\n--- globals ---');
['app', 'BrowserWindow', 'Menu', 'dialog', 'ipcMain'].forEach(k => {
  console.log(`global.${k}:`, typeof global[k]);
});

// Check if electron API is available via process.moduleLoadList
console.log('\nmoduleLoadList sample:', process.moduleLoadList?.filter(m => m.includes('electron')).slice(0,10));

// Try electron/js2c/browser_init and similar
const builtinModules = require('module').builtinModules;
console.log('\nall electron builtins:', builtinModules.filter(m => m.includes('electron')));
