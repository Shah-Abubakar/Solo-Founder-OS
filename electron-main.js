const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs-extra')
const { spawn } = require('child_process')

const ROOT = __dirname
const BACKEND = path.join(ROOT, 'backend')

let mainWindow = null
let nextProcess = null
let backendProcess = null

// ---- File system IPC handlers ----

ipcMain.handle('fs:readFile', async (_event, filePath) => {
  const resolved = path.resolve(ROOT, filePath)
  return fs.readFile(resolved, 'utf-8')
})

ipcMain.handle('fs:writeFile', async (_event, filePath, content) => {
  const resolved = path.resolve(ROOT, filePath)
  await fs.ensureDir(path.dirname(resolved))
  await fs.writeFile(resolved, content, 'utf-8')
  return { success: true }
})

ipcMain.handle('fs:deleteFile', async (_event, filePath) => {
  const resolved = path.resolve(ROOT, filePath)
  await fs.remove(resolved)
  return { success: true }
})

ipcMain.handle('fs:readDir', async (_event, dirPath) => {
  const resolved = path.resolve(ROOT, dirPath)
  const items = await fs.readdir(resolved, { withFileTypes: true })
  return items.map((entry) => ({
    name: entry.name,
    isDirectory: entry.isDirectory(),
    isFile: entry.isFile(),
    path: path.join(resolved, entry.name),
  }))
})

ipcMain.handle('fs:stat', async (_event, filePath) => {
  const resolved = path.resolve(ROOT, filePath)
  const s = await fs.stat(resolved)
  return {
    size: s.size,
    isDirectory: s.isDirectory(),
    isFile: s.isFile(),
    created: s.birthtime,
    modified: s.mtime,
  }
})

ipcMain.handle('fs:exists', async (_event, filePath) => {
  const resolved = path.resolve(ROOT, filePath)
  return fs.pathExists(resolved)
})

// ---- Dialog IPC handlers ----

ipcMain.handle('dialog:openDirectory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  })
  if (result.canceled) return null
  return result.filePaths[0] || null
})

ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'JavaScript', extensions: ['js', 'ts', 'jsx', 'tsx'] },
      { name: 'JSON', extensions: ['json'] },
      { name: 'Markdown', extensions: ['md'] },
    ],
  })
  return result.filePaths[0] || null
})

ipcMain.handle('dialog:saveFile', async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'JavaScript', extensions: ['js', 'ts', 'jsx', 'tsx'] },
      { name: 'JSON', extensions: ['json'] },
      { name: 'Markdown', extensions: ['md'] },
    ],
  })
  return result.filePath || null
})

// ---- Server processes ----

function startNext() {
  return new Promise((resolve, reject) => {
    nextProcess = spawn('npx', ['next', 'dev'], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, PORT: '3000' },
      shell: true,
    })
    nextProcess.stdout.on('data', (data) => {
      const text = data.toString()
      console.log(`[next] ${text}`)
      if (text.includes('localhost:3000') || text.includes('ready')) resolve()
    })
    nextProcess.stderr.on('data', (data) => process.stderr.write(`[next:err] ${data}`))
    nextProcess.on('error', reject)
    setTimeout(() => resolve(), 8000)
  })
}

function startBackend() {
  return new Promise((resolve, reject) => {
    backendProcess = spawn('node', ['src/index.js'], {
      cwd: BACKEND,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, PORT: '3001' },
      shell: true,
    })
    backendProcess.stdout.on('data', (data) => {
      const text = data.toString()
      console.log(`[backend] ${text}`)
      if (text.includes('running on http')) resolve()
    })
    backendProcess.stderr.on('data', (data) => process.stderr.write(`[backend:err] ${data}`))
    backendProcess.on('error', reject)
    setTimeout(() => resolve(), 5000)
  })
}

function shutdown() {
  console.log('\nShutting down...')
  if (nextProcess) { nextProcess.kill('SIGTERM'); nextProcess = null }
  if (backendProcess) { backendProcess.kill('SIGTERM'); backendProcess = null }
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.close()
}

// ---- Electron lifecycle ----

app.whenReady().then(async () => {
  console.log('Starting Solo Founder OS (Electron)...')

  await startBackend()
  console.log('Backend running on http://localhost:3001')

  await startNext()
  console.log('Frontend running on http://localhost:3000')

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    titleBarStyle: 'hiddenInset',
    show: false,
  })

  mainWindow.loadURL('http://localhost:3000')

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    shutdown()
  })
})

app.on('window-all-closed', () => {
  shutdown()
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    app.quit()
  }
})

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
