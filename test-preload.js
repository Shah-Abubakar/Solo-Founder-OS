const { contextBridge, ipcRenderer } = require('electron');
console.log('preload loaded', typeof contextBridge, typeof ipcRenderer);
