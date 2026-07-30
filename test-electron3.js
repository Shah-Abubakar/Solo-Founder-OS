const electronPath = require('electron');
console.log('electron path:', electronPath);

// Use the binary path to find the asar
const path = require('path');
const distDir = path.dirname(electronPath);
console.log('dist dir:', distDir);

// The built-in electron modules are inside the asar
const resourcesDir = path.join(distDir, 'resources');
console.log('resources dir:', resourcesDir);

// Electron's main module define properties file
const defaultApp = path.join(resourcesDir, 'default_app.asar');
console.log('default_app.asar exists:', require('fs').existsSync(defaultApp));

// Check if there's an electron.asar
const electronAsar = path.join(resourcesDir, 'electron.asar');
console.log('electron.asar exists:', require('fs').existsSync(electronAsar));

// In some installations, the API is at a different path
const appAsar = path.join(resourcesDir, 'app.asar');
console.log('app.asar exists:', require('fs').existsSync(appAsar));
console.log('resources contents:', require('fs').existsSync(resourcesDir) ? 
  require('fs').readdirSync(resourcesDir).join(', ') : 'not found');
