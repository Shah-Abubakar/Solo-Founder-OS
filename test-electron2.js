const { app, BrowserWindow, ipcMain, dialog } = require('electron');
app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 800, height: 600,
    webPreferences: {
      preload: require('path').join(__dirname, 'test-preload.js')
    }
  });
  win.loadURL('data:text/html,<h1>Hello</h1>');
  setTimeout(() => app.quit(), 2000);
});
