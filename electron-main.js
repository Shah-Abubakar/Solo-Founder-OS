const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const fs = require('fs')

let mainWindow
let backendProcess
let nextProcess

// IPC handlers
ipcMain.handle('get-app-version', () => app.getVersion())
ipcMain.handle('get-database-path', () => path.join(__dirname, 'data', 'solo-founder-os.db'))
ipcMain.on('minimize-window', () => { if (mainWindow) mainWindow.minimize() })
ipcMain.on('maximize-window', () => { if (mainWindow) { mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize() } })
ipcMain.on('close-window', () => { if (mainWindow) mainWindow.close() })

// Create the browser window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'build', 'icon.png'),
    backgroundColor: '#0a0a0a',
    show: false,
    frame: true,
    titleBarStyle: 'default'
  })

  // Load the app
  mainWindow.loadURL('http://localhost:3000')

  // Show when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Start Next.js standalone server
function startNextServer() {
  return new Promise((resolve, reject) => {
    const serverScript = path.join(__dirname, '.next', 'standalone', 'server.js')
    const isWindows = process.platform === 'win32'

    if (!fs.existsSync(serverScript)) {
      console.log('Standalone server not found at', serverScript)
      console.log('Falling back to next start...')
      const nextPath = path.join(__dirname, 'node_modules', '.bin', 'next')
      const cmd = isWindows ? 'cmd' : 'sh'
      const args = isWindows ? ['/c', nextPath, 'start'] : ['-c', `${nextPath} start`]
      nextProcess = spawn(cmd, args, {
        cwd: __dirname,
        stdio: 'pipe',
        env: { ...process.env, NODE_ENV: 'production' }
      })
      nextProcess.stdout.on('data', (data) => {
        const output = data.toString()
        if (output.includes('started') || output.includes('ready') || output.includes('localhost:3000')) {
          resolve()
        }
      })
      nextProcess.stderr.on('data', (data) => {
        console.error('Next Error:', data.toString())
      })
      setTimeout(() => resolve(), 30000)
      return
    }

    nextProcess = spawn('node', [serverScript], {
      cwd: path.join(__dirname, '.next', 'standalone'),
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'production', PORT: '3000' }
    })

    nextProcess.stdout.on('data', (data) => {
      const output = data.toString()
      console.log('Next:', output)
      if (output.includes('localhost:3000') || output.includes('started') || output.includes('ready')) {
        resolve()
      }
    })

    nextProcess.stderr.on('data', (data) => {
      console.error('Next Error:', data.toString())
    })

    setTimeout(() => resolve(), 30000)
  })
}

// Run database setup
async function ensureDatabase() {
  const dataPath = path.join(__dirname, 'data')
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true })
  }

  const dbPath = path.join(dataPath, 'solo-founder-os.db')
  if (!fs.existsSync(dbPath)) {
    console.log('Database not found, running setup...')
    await new Promise((resolve) => {
      const setup = spawn('node', [path.join(__dirname, 'scripts', 'setup-db.js')], {
        cwd: __dirname,
        stdio: 'pipe'
      })
      setup.stdout.on('data', (d) => console.log(d.toString()))
      setup.stderr.on('data', (d) => console.error(d.toString()))
      setup.on('close', (code) => {
        console.log('Setup exited with code', code)
        resolve()
      })
      setTimeout(() => resolve(), 15000)
    })
  }
}

// App lifecycle
app.whenReady().then(async () => {
  console.log('Starting Solo Founder OS...')
  await ensureDatabase()
  console.log('Starting Next.js server...')
  const timeout = setTimeout(() => {
    console.log('Server start timeout — creating window anyway')
    createWindow()
  }, 25000)
  await startNextServer()
  clearTimeout(timeout)
  console.log('Creating window...')
  createWindow()
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) backendProcess.kill()
    if (nextProcess) nextProcess.kill()
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Clean up on exit
process.on('exit', () => {
  if (backendProcess) backendProcess.kill()
  if (nextProcess) nextProcess.kill()
})
