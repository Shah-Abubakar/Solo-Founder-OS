const { app } = require('electron'); console.log('App:', typeof app); if (app) { console.log('Electron:', process.versions.electron); app.quit(); }
