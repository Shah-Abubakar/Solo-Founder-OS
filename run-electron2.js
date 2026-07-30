const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const ROOT = __dirname;
const ELECTRON_BIN = path.join(ROOT, 'node_modules', 'electron', 'dist', 'electron.exe');

const env = Object.fromEntries(
  Object.entries(process.env).filter(([k]) => k !== 'ELECTRON_RUN_AS_NODE')
);

const log = fs.createWriteStream(path.join(ROOT, 'electron_launch.log'), { flags: 'w' });
log.write(Starting Electron...\n);

const child = spawn(ELECTRON_BIN, [ROOT], {
  cwd: ROOT,
  stdio: ['ignore', 'pipe', 'pipe'],
  env,
  windowsHide: false,
});

child.stdout.on('data', (d) => log.write(d.toString()));
child.stderr.on('data', (d) => log.write(d.toString()));
child.on('close', (code) => { log.write(Exited with code \n); log.end(); });
child.on('error', (e) => { log.write(Error: \n); log.end(); });
