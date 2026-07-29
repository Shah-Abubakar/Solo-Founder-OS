const { contextBridge, ipcRenderer } = require('electron');

try {
  console.log('Preload - contextBridge:', typeof contextBridge);
  console.log('Preload - ipcRenderer:', typeof ipcRenderer);
  
  contextBridge.exposeInMainWorld('testAPI', {
    ping: () => 'pong'
  });
  
  console.log('Preload - API exposed successfully');
} catch(e) {
  console.log('Preload error:', e.message);
}
