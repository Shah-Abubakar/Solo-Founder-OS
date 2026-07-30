const { app } = require('electron'); console.log('App version:', app.getVersion ? app.getVersion() : 'no getVersion'); console.log('Electron version:', process.versions.electron); app.quit();
