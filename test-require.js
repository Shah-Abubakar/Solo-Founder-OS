const electron = require('electron');
console.log('electron type:', typeof electron);
console.log('electron keys:', Object.keys(electron));
console.log('has app:', 'app' in electron);
if (electron.app) {
  console.log('app type:', typeof electron.app);
  console.log('has whenReady:', typeof electron.app.whenReady);
}