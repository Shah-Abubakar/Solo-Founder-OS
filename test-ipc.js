const electron = require('electron');
console.log('Type:', typeof electron);
console.log('Is function:', typeof electron === 'function');
console.log('Keys:', Object.keys(electron).slice(0,30).join(', '));
console.log('Has ipcMain:', 'ipcMain' in electron);
console.log('Has app:', 'app' in electron);
console.log('app prop:', typeof Object.getOwnPropertyDescriptor(electron, 'app'));
setTimeout(() => { require('electron').app.quit(); }, 1000);
