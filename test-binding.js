console.log('process.type:', process.type);
console.log('process.versions.electron:', process.versions.electron);
console.log('process._linkedBinding exists:', typeof process._linkedBinding);
let electron;
try { electron = require('electron'); } catch(e) { console.log('require error:', e.message); }
console.log('electron from require:', typeof electron, electron?.substring?.(0, 80));
try { electron = process._linkedBinding('electron'); } catch(e) { console.log('binding error:', e.message, e.stack?.substring(0,200)); }
if (electron) console.log('electron from binding:', typeof electron, Object.keys(electron).slice(0, 10));
