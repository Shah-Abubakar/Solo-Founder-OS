const { spawn } = require('child_process');
const path = require('path');
const ROOT = __dirname;
const ELECTRON_BIN = path.join(ROOT, 'node_modules', 'electron', 'dist', 'electron.exe');

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const child = spawn(ELECTRON_BIN, [ROOT], {
  cwd: ROOT,
  stdio: 'inherit',
  env,
  windowsHide: false,
});

child.on('close', (code) => {
  process.exit(code ?? 1);
});
