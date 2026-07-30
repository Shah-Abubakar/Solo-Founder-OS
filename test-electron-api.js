const electron = require('electron'); console.log('Keys:', Object.keys(electron).sort().join(', ')); console.log('Has app:', !!electron.app); console.log('Has ipcMain:', !!electron.ipcMain);
