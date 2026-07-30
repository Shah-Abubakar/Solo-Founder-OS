const paths = [
  'electron',
  'electron/main',
  'original-fs',
  'electron/common',
  'electron/renderer'
];

paths.forEach(p => {
  try {
    const resolved = require.resolve(p);
    const mod = require(p);
    console.log(p + ':', typeof mod, mod ? Object.keys(mod).slice(0,8).join(',') : 'nullish');
  } catch(e) {
    console.log(p + ': ERROR - ' + e.message.substring(0, 60));
  }
});

console.log('\nprocess.type:', process.type);
console.log('Built-in electron modules:', require('module').builtinModules.filter(m => m.includes('electron') || m.includes('atom') || m.includes('original')));
